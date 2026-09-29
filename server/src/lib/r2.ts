import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Environment variables validation
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Initialize S3 client for Cloudflare R2
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
const R2_BUCKET = process.env.R2_BUCKET || "";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    // Validate required env vars on first use
    getRequiredEnv("R2_ACCOUNT_ID");
    getRequiredEnv("R2_ACCESS_KEY_ID");
    getRequiredEnv("R2_SECRET_ACCESS_KEY");
    getRequiredEnv("R2_BUCKET");
    getRequiredEnv("R2_PUBLIC_URL");

    s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
}

export interface UploadResult {
  key: string;
  url: string;
}

/**
 * Upload audio file to R2
 * @param flashcardId - The flashcard ID
 * @param mp3Buffer - MP3 audio data as Buffer
 * @returns Object with key and public URL
 */
export async function uploadAudio(
  flashcardId: number,
  mp3Buffer: Buffer
): Promise<UploadResult> {
  const client = getS3Client();
  const key = `audio/flashcard-${flashcardId}-${Date.now()}.mp3`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: mp3Buffer,
    ContentType: "audio/mpeg",
    CacheControl: "public, max-age=31536000, immutable",
  });

  await client.send(command);

  const url = `${R2_PUBLIC_URL}/${key}`;

  return { key, url };
}

/**
 * Delete audio file from R2
 * @param key - The R2 object key
 */
export async function deleteAudio(key: string | null | undefined): Promise<void> {
  if (!key) {
    return; // No-op if key is falsy
  }

  try {
    const client = getS3Client();
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    });

    await client.send(command);
  } catch (error) {
    // Log but don't throw - orphaned objects are harmless
    console.error(`Failed to delete audio from R2 (key: ${key}):`, error);
  }
}
