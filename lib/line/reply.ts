import { lineChannelAccessToken } from "@/lib/env/line-channel-access-token";

export async function reply(replyToken: string, messages: unknown[]): Promise<void> {
  const response = await fetch(
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

  if (!response.ok) {
    console.error(JSON.stringify({
      function: "lib.line.broadcast",
      status: response.status,
      body: await response.text(),
    }));
  }
}
