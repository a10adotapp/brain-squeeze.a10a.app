import { z } from "zod";

const envSchema = z.object({
  APP_URL: z.string().min(1),
});

export function appUrl() {
  return envSchema.parse(process.env).APP_URL;
}
