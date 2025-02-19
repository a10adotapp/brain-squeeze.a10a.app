import { lineChannelSecret } from "@/lib/env/line-channel-secret";
import { downloadMediaContent } from "@/lib/line/download-media-content";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { z } from "zod";
import { answer } from "./answer";

export async function POST(request: NextRequest): Promise<Response> {
  const requestBody = await request.text();

  const signature = createHmac("SHA256", lineChannelSecret())
    .update(requestBody)
    .digest("base64");

  if (signature !== request.headers.get("x-line-signature")) {
    return NextResponse.error();
  }

  const requestData = JSON.parse(requestBody);

  for (const event of requestData.events) {
    await prisma.webhookEvent.create({
      data: {
        event: event,
      },
    });

    if (event.source.type === "user") {
      if (event.message) {
        if (event.message.contentProvider?.type === "line") {
          await downloadMediaContent(event.message.id);
        }
      }

      if (event.postback) {
        const data = JSON.parse(event.postback.data);

        if (data.action === "answer") {
          const answerSchema = z.object({
            question: z.string().cuid2(),
            option: z.string().cuid2(),
          });

          const parsedData = answerSchema.parse(data);

          await answer(event.source.userId, {
            questionId: parsedData.question,
            questionOptionId: parsedData.option,
            replyToken: event.replyToken,
          });
        }
      }
    }
  }

  return NextResponse.json({
    message: "ok",
  });
}
