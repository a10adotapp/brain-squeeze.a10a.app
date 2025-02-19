import { z } from "zod";

const envSchema = z.object({
  WEBHOOK_IMAGE_DOWNLOAD_DIRNAME: z.string().min(1),
});

export function webhookImageDownloadDirname() {
  return envSchema.parse(process.env).WEBHOOK_IMAGE_DOWNLOAD_DIRNAME;
}
