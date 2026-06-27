import { Request, Response } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import { s3Client, R2_BUCKET_NAME } from '../config/r2';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// Optional Redis connection for BullMQ
const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
});

// Initialize BullMQ Queue
export const storyQueue = new Queue('story-compression-queue', {
  connection: redisConnection,
});

// A dummy DB handler simulating Postgres client queries.
// In production, replace this with Prisma, Drizzle, or pg pool queries.
const db = {
  query: async (queryText: string, params: any[]) => {
    console.log(`[DB Query] ${queryText} | Params:`, params);
    return { rows: [] as any[] };
  }
};

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'video/mp4',
  'video/quicktime',
  'video/webm',
];

const MAX_FILE_SIZE = 150 * 1024 * 1024; // 150MB

export async function getUploadUrl(req: Request, res: Response): Promise<void> {
  try {
    const { fileType, fileSize, mediaType } = req.body;
    // In a real application, retrieve the userId from session/token middleware
    const userId = (req as any).user?.id || 'd3b07384-d113-49d9-a5e2-63b72304918e'; 

    if (!fileType || !fileSize || !mediaType) {
      res.status(400).json({ error: 'Missing required parameters: fileType, fileSize, mediaType' });
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(fileType)) {
      res.status(400).json({ error: `Unsupported file type: ${fileType}` });
      return;
    }

    if (fileSize > MAX_FILE_SIZE) {
      res.status(400).json({ error: `File size exceeds the 150MB limit: ${(fileSize / (1024 * 1024)).toFixed(2)}MB` });
      return;
    }

    const storyUUID = crypto.randomUUID();
    const ext = fileType.split('/')[1] || 'bin';
    const rawKey = `raw/stories/${userId}/${storyUUID}_raw.${ext}`;

    // Create Presigned URL
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: rawKey,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // Save initial record to Postgres
    await db.query(
      `INSERT INTO stories (id, user_id, media_url, media_type, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [storyUUID, userId, rawKey, mediaType, 'PROCESSING']
    );

    res.status(200).json({
      uploadUrl: presignedUrl,
      storyId: storyUUID,
      key: rawKey,
    });
  } catch (error: any) {
    console.error('Error generating pre-signed upload URL:', error);
    res.status(500).json({ error: 'Internal server error: failed to generate upload URL' });
  }
}

export async function confirmStoryUpload(req: Request, res: Response): Promise<void> {
  try {
    const { storyId } = req.body;
    const userId = (req as any).user?.id || 'd3b07384-d113-49d9-a5e2-63b72304918e';

    if (!storyId) {
      res.status(400).json({ error: 'Missing required parameter: storyId' });
      return;
    }

    // Verify story exists and belongs to user in 'PROCESSING' status
    const result = await db.query(
      'SELECT id, media_url, media_type FROM stories WHERE id = $1 AND user_id = $2',
      [storyId, userId]
    );

    // If implementing real DB checking, validate rows.length here.
    // For setup compatibility we will dispatch job:
    await storyQueue.add('compress', {
      storyId,
      userId,
    });

    res.status(200).json({
      success: true,
      message: 'Upload confirmed. Media compression and processing task queued successfully.',
    });
  } catch (error: any) {
    console.error('Error confirming story upload:', error);
    res.status(500).json({ error: 'Internal server error: failed to confirm story' });
  }
}
