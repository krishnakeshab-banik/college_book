import { Worker, Job } from 'bullmq';
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, R2_BUCKET_NAME } from '../config/r2';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import IORedis from 'ioredis';

// Optional Redis connection for BullMQ Worker
const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
});

// A dummy DB handler matching Postgres client queries.
// In production, replace this with Prisma, Drizzle, or pg pool queries.
const db = {
  query: async (queryText: string, params: any[]) => {
    console.log(`[Worker DB Query] ${queryText} | Params:`, params);
    return { rows: [] as any[] };
  }
};

// Helper: Get public URL for R2 objects
const getR2PublicUrl = (key: string) => {
  const publicDomain = process.env.R2_PUBLIC_DOMAIN || 'https://pub-media.collegebook.dev';
  return `${publicDomain}/${key}`;
};

export const storyWorker = new Worker(
  'story-compression-queue',
  async (job: Job) => {
    const { storyId, userId } = job.data;
    console.log(`[Story Worker] Starting processing for story: ${storyId}, user: ${userId}`);

    // Fetch story metadata from DB
    // In production, use SELECT * FROM stories WHERE id = $1
    // We will simulate fetching based on database query
    const rows = [
      {
        id: storyId,
        user_id: userId,
        media_url: `raw/stories/${userId}/${storyId}_raw.mp4`, // dummy fallback
        media_type: 'VIDEO', // dummy fallback
      }
    ];
    const story = rows[0];

    const rawKey = story.media_url;
    const isVideo = story.media_type === 'VIDEO';
    const ext = rawKey.split('.').pop() || 'bin';

    const localRawPath = path.join(os.tmpdir(), `${storyId}_raw.${ext}`);
    const localProcessedPath = path.join(os.tmpdir(), isVideo ? `${storyId}.mp4` : `${storyId}.webp`);
    const localThumbPath = path.join(os.tmpdir(), `${storyId}_thumb.webp`);
    const localScreenshotPath = path.join(os.tmpdir(), `${storyId}_screenshot.png`);

    try {
      // 1. Download raw file from Cloudflare R2
      console.log(`[Story Worker] Downloading raw file: ${rawKey} to local temp path: ${localRawPath}`);
      const downloadResponse = await s3Client.send(
        new GetObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: rawKey,
        })
      );

      if (!downloadResponse.Body) {
        throw new Error('Downloaded object body is empty');
      }

      await pipeline(downloadResponse.Body as Readable, fs.createWriteStream(localRawPath));
      console.log(`[Story Worker] Download completed successfully.`);

      let finalMediaKey = '';
      let finalThumbKey = '';

      // 2. Perform compression
      if (!isVideo) {
        // IMAGE COMPRESSION (using sharp)
        console.log(`[Story Worker] Processing image with sharp...`);
        await sharp(localRawPath)
          .resize({
            width: 1080,
            height: 1920,
            fit: 'cover', // crop from center to enforce 9:16 vertical standard
          })
          .webp({ quality: 80 })
          .toFile(localProcessedPath);

        finalMediaKey = `processed/stories/${userId}/${storyId}.webp`;
        finalThumbKey = finalMediaKey; // Image stories use their main URL as thumbnail

        // Upload processed WebP image to R2
        console.log(`[Story Worker] Uploading compressed image to R2: ${finalMediaKey}`);
        await s3Client.send(
          new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: finalMediaKey,
            Body: fs.createReadStream(localProcessedPath),
            ContentType: 'image/webp',
          })
        );
      } else {
        // VIDEO TRANSCODING & COMPRESSION (using fluent-ffmpeg)
        console.log(`[Story Worker] Transcoding video to vertical 1080x1920 MP4...`);
        await new Promise<void>((resolve, reject) => {
          ffmpeg(localRawPath)
            .videoFilters([
              'scale=1080:1920:force_original_aspect_ratio=increase',
              'crop=1080:1920',
            ])
            .videoCodec('libx264')
            .audioCodec('aac')
            .fps(30)
            .outputOptions([
              '-maxrate 3500k',
              '-bufsize 7000k',
              '-movflags +faststart', // places index at start for instant web play
              '-pix_fmt yuv420p',
            ])
            .output(localProcessedPath)
            .on('start', (cmd) => console.log('[FFmpeg Command]:', cmd))
            .on('end', () => {
              console.log('[Story Worker] Video transcoding complete.');
              resolve();
            })
            .on('error', (err) => {
              console.error('[FFmpeg Error]:', err);
              reject(err);
            })
            .run();
        });

        // Extract a thumbnail screenshot at 1.0s mark
        console.log(`[Story Worker] Extracting video thumbnail screenshot at 1s mark...`);
        await new Promise<void>((resolve, reject) => {
          ffmpeg(localRawPath)
            .screenshots({
              timestamps: ['1.0'],
              filename: `${storyId}_screenshot.png`,
              folder: os.tmpdir(),
              size: '540x960',
            })
            .on('end', () => resolve())
            .on('error', (err) => reject(err));
        });

        // Compress extracted screenshot to WebP using sharp
        console.log(`[Story Worker] Compressing extracted screenshot to WebP...`);
        await sharp(localScreenshotPath)
          .webp({ quality: 75 })
          .toFile(localThumbPath);

        finalMediaKey = `processed/stories/${userId}/${storyId}.mp4`;
        finalThumbKey = `processed/stories/${userId}/${storyId}_thumb.webp`;

        // Upload processed MP4 Video to R2
        console.log(`[Story Worker] Uploading compressed video to R2: ${finalMediaKey}`);
        await s3Client.send(
          new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: finalMediaKey,
            Body: fs.createReadStream(localProcessedPath),
            ContentType: 'video/mp4',
          })
        );

        // Upload WebP thumbnail to R2
        console.log(`[Story Worker] Uploading WebP video thumbnail to R2: ${finalThumbKey}`);
        await s3Client.send(
          new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: finalThumbKey,
            Body: fs.createReadStream(localThumbPath),
            ContentType: 'image/webp',
          })
        );
      }

      // 3. Delete raw staging file from R2
      console.log(`[Story Worker] Deleting raw staging file from R2: ${rawKey}`);
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: rawKey,
        })
      );

      // 4. Update DB status to 'READY' and set processed URLs
      console.log(`[Story Worker] Updating DB story status to READY`);
      await db.query(
        `UPDATE stories 
         SET media_url = $1, thumbnail_url = $2, status = 'READY', created_at = NOW() 
         WHERE id = $3`,
        [getR2PublicUrl(finalMediaKey), getR2PublicUrl(finalThumbKey), storyId]
      );

      console.log(`[Story Worker] Job completed successfully for story: ${storyId}`);
    } catch (error) {
      console.error(`[Story Worker] Failed to process story ${storyId}:`, error);

      // Mark DB record as FAILED
      await db.query(
        `UPDATE stories SET status = 'FAILED' WHERE id = $1`,
        [storyId]
      );
      throw error;
    } finally {
      // 5. Cleanup local temp files
      const pathsToDelete = [localRawPath, localProcessedPath, localThumbPath, localScreenshotPath];
      for (const p of pathsToDelete) {
        if (fs.existsSync(p)) {
          try {
            fs.unlinkSync(p);
            console.log(`[Story Worker] Deleted local temp file: ${p}`);
          } catch (cleanupErr) {
            console.warn(`[Story Worker] Failed to delete local temp file ${p}:`, cleanupErr);
          }
        }
      }
    }
  },
  {
    connection: redisConnection,
    concurrency: 2, // Limit concurrent ffmpeg transcodes to prevent CPU pegging
  }
);
