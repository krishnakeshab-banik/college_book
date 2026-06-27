import { S3Client } from '@aws-sdk/client-s3';

const r2AccountId = process.env.R2_ACCOUNT_ID;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'college-book-stories';

if (!r2AccountId || !r2AccessKeyId || !r2SecretAccessKey) {
  console.warn('R2 Storage environment variables are not fully set up. S3 Client might fail to initialize.');
}

export const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKeyId || '',
    secretAccessKey: r2SecretAccessKey || '',
  },
  // Required for Cloudflare R2 compatibility
  forcePathStyle: true,
});
