import cron from 'node-cron';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { s3Client, R2_BUCKET_NAME } from '../config/r2';

// A dummy DB handler matching Postgres client queries.
// In production, replace this with Prisma, Drizzle, or pg pool queries.
const db = {
  query: async (queryText: string, params?: any[]) => {
    console.log(`[Cron DB Query] ${queryText} | Params:`, params);
    // In production this returns list of expired stories
    return { 
      rows: [] as Array<{ id: string; media_url: string; thumbnail_url: string; status: string }> 
    };
  }
};

// Helper: Extract R2 storage key from absolute public URL
// E.g. "https://pub-media.collegebook.dev/processed/stories/user/id.mp4" -> "processed/stories/user/id.mp4"
const extractR2KeyFromUrl = (url: string | null): string | null => {
  if (!url) return null;
  const publicDomain = process.env.R2_PUBLIC_DOMAIN || 'https://pub-media.collegebook.dev';
  if (url.startsWith(publicDomain)) {
    return url.replace(`${publicDomain}/`, '');
  }
  // Fallback if URL is already a key or structured differently
  try {
    const parsed = new URL(url);
    return parsed.pathname.substring(1); // removes leading slash
  } catch (e) {
    return url;
  }
};

// Schedule cleanup job to run every hour
export const storyCleanupJob = cron.schedule('0 * * * *', async () => {
  console.log('[Cron Job] Checking for expired stories...');
  try {
    // 1. Query stories that have expired and are currently READY
    const result = await db.query(
      `SELECT id, media_url, thumbnail_url, status 
       FROM stories 
       WHERE expires_at <= NOW() AND status = 'READY'`
    );

    const expiredStories = result.rows;

    if (expiredStories.length === 0) {
      console.log('[Cron Job] No expired stories to clean up.');
      return;
    }

    console.log(`[Cron Job] Found ${expiredStories.length} expired stories. Deleting physical assets from R2...`);

    // 2. Prepare keys list for batch deletion
    const keysToDelete: Array<{ Key: string }> = [];

    for (const story of expiredStories) {
      const mediaKey = extractR2KeyFromUrl(story.media_url);
      const thumbKey = extractR2KeyFromUrl(story.thumbnail_url);

      if (mediaKey) keysToDelete.push({ Key: mediaKey });
      // Avoid duplicate keys if image story (where mediaKey === thumbKey)
      if (thumbKey && thumbKey !== mediaKey) keysToDelete.push({ Key: thumbKey });
    }

    if (keysToDelete.length > 0) {
      // S3 DeleteObjects supports batch deletion of up to 1000 objects
      console.log(`[Cron Job] Batch deleting ${keysToDelete.length} files from R2...`);
      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: R2_BUCKET_NAME,
          Delete: {
            Objects: keysToDelete,
            Quiet: true,
          },
        })
      );
      console.log('[Cron Job] R2 assets deleted successfully.');
    }

    // 3. Batch update DB status to 'EXPIRED'
    const expiredIds = expiredStories.map(s => s.id);
    await db.query(
      `UPDATE stories 
       SET status = 'EXPIRED' 
       WHERE id = ANY($1)`,
      [expiredIds]
    );

    console.log(`[Cron Job] Successfully cleaned up and marked ${expiredIds.length} stories as EXPIRED.`);
  } catch (error) {
    console.error('[Cron Job] Error cleaning up expired stories:', error);
  }
});
