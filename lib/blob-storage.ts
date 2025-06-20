import { put, del } from "@vercel/blob"

export class BlobStorage {
  async uploadFile(file: File, folder = "documents"): Promise<string> {
    try {
      const filename = `${folder}/${Date.now()}-${file.name}`
      const blob = await put(filename, file, {
        access: "public",
      })

      return blob.url
    } catch (error) {
      console.error("Failed to upload file:", error)
      throw new Error("File upload failed")
    }
  }

  async deleteFile(url: string): Promise<void> {
    try {
      await del(url)
    } catch (error) {
      console.error("Failed to delete file:", error)
      throw new Error("File deletion failed")
    }
  }

  async uploadMultipleFiles(files: File[], folder = "documents"): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder))
    return Promise.all(uploadPromises)
  }

  extractFileNameFromUrl(url: string): string {
    return url.split("/").pop() || "unknown"
  }

  getFileExtension(filename: string): string {
    return filename.split(".").pop()?.toLowerCase() || ""
  }

  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type)
  }

  validateFileSize(file: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    return file.size <= maxSizeBytes
  }
}

export const blobStorage = new BlobStorage()
