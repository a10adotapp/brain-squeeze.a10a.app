"use server";

import { lineMiniappLiffId } from "@/lib/env/line-miniapp-liff-id";

export async function getLineMiniappLiffId(): Promise<string> {
  return lineMiniappLiffId();
}
