import { z } from "zod";

const envSchema = z.object({
  CRONSCRIPT_TOKEN: z.string().optional()
    .transform((v) => v || undefined),
});

export function cronscriptToken() {
  return envSchema.parse(process.env).CRONSCRIPT_TOKEN;
}
