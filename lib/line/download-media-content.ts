import { lineChannelAccessToken } from "@/lib/env/line-channel-access-token";
import { webhookImageDownloadDirname } from "@/lib/env/webhook-image-download-dirname";
import { extension } from "mime-types";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

// https://developers.line.biz/ja/docs/messaging-api/receiving-messages/#getting-content-file-sent-by-users
export async function downloadMediaContent(messageId: string): Promise<void> {
  const response = await fetch(
    `https://api-data.line.me/v2/bot/message/${messageId}/content`,
    {
      headers: {
        "authorization": `Bearer ${lineChannelAccessToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`failed to download media content (${JSON.stringify({
      messageId,
      status: response.status,
      error: await response.text(),
    })})`);
  }

  await writeFile(
    join(
      webhookImageDownloadDirname(),
      `${messageId}.${extension(response.headers.get("content-type") || "application/octet-stream")}`,
    ),
    Buffer.from(await response.arrayBuffer()),
  );
}
