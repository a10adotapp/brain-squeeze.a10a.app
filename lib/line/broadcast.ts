import { lineChannelAccessToken } from "@/lib/env/line-channel-access-token";

export async function broadcast(messages: unknown[]): Promise<void> {
  const response = await fetch(
    "https://api.line.me/v2/bot/message/broadcast",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${lineChannelAccessToken()}`,
      },
      body: JSON.stringify({
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
