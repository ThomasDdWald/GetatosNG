/**
 * Upload an image to Google Cloud Storage
 * Note: With uniform bucket-level access, files are publicly readable by default
 */
export declare function uploadImage(file: Express.Multer.File): Promise<{
    url: string;
    publicUrl: string;
}>;
/**
 * Delete an image from Google Cloud Storage
 */
export declare function deleteImage(filename: string): Promise<void>;
/**
 * Check if GCS is configured
 */
export declare function isGcsConfigured(): boolean;
//# sourceMappingURL=gcsService.d.ts.map