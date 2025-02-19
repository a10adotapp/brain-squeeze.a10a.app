import { z } from "zod";

const envSchema = z.object({
  LINE_CHANNEL_SECRET: z.string().min(1),
});

export function lineChannelSecret() {
  return envSchema.parse(process.env).LINE_CHANNEL_SECRET;
}
