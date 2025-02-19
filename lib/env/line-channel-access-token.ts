import { z } from "zod";

const envSchema = z.object({
  LINE_CHANNEL_ACCESS_TOKEN: z.string().min(1),
});

export function lineChannelAccessToken() {
  return envSchema.parse(process.env).LINE_CHANNEL_ACCESS_TOKEN;
}
