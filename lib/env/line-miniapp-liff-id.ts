import { z } from "zod";

const envSchema = z.object({
  LINE_MINIAPP_LIFF_ID: z.string().min(1),
});

export function lineMiniappLiffId() {
  return envSchema.parse(process.env).LINE_MINIAPP_LIFF_ID;
}
