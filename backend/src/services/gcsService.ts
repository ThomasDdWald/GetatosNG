import { Storage } from '@google-cloud/storage'

const bucketName = process.env.GCS_BUCKET_NAME || 'getatos-images-867468173620'

// Initialize GCS client
const storage = new Storage()
const bucket = storage.bucket(bucketName)

/**
 * Upload an image to Google Cloud Storage
 * Note: With uniform bucket-level access, files are publicly readable by default
 */
export async function uploadImage(
  file: Express.Multer.File
): Promise<{ url: string; publicUrl: string }> {
  const filename = file.filename
  const blob = bucket.file(`gallery/${filename}`)

  // Upload the file - with uniform bucket-level access, it's automatically public
  await blob.save(file.buffer, {
    contentType: file.mimetype,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  })

  // Generate public URL (works with uniform bucket-level access)
  const publicUrl = `https://storage.googleapis.com/${bucketName}/gallery/${filename}`

  return {
    url: `/images/gallery/${filename}`,
    publicUrl,
  }
}

/**
 * Delete an image from Google Cloud Storage
 */
export async function deleteImage(filename: string): Promise<void> {
  const file = bucket.file(`gallery/${filename}`)
  await file.delete()
}

/**
 * Check if GCS is configured
 */
export function isGcsConfigured(): boolean {
  return !!bucketName && bucketName !== ''
}