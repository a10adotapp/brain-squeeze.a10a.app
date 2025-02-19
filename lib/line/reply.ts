import { lineChannelAccessToken } from "@/lib/env/line-channel-access-token";

export async function reply(replyToken: string, messages: unknown[]): Promise<void> {
  await fetch(
    "https://api.line.me/v2/bot/message/reply",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${lineChannelAccessToken()}`,
      },
      body: JSON.stringify({
        replyToken,
        messages,
      }),
    },
  );
}
