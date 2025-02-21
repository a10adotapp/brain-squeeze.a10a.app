"use client";

import { Context as LiffContext } from "@/app/_contexts/liff-context";
import { use } from "react";

export default function Page() {
  const { liff } = use(LiffContext);

  return JSON.stringify(liff?.getContext(), null, "  ");
}
