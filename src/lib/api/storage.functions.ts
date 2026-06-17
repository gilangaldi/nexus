import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function base64ToBytes(base64: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    const buffer = Buffer.from(base64, "base64");
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export const uploadAssetThumbnail = createServerFn({ method: "POST" })
  .validator(
    z.object({
      userId: z.string().min(1),
      fileName: z.string().min(1),
      contentType: z.string().min(1),
      base64Data: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const { uploadNexusAssetThumbnail } = await import("@/lib/storage.server");
    const bytes = base64ToBytes(data.base64Data);
    return uploadNexusAssetThumbnail(data.userId, data.fileName, bytes, data.contentType);
  });
