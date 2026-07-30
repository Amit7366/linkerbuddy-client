import { NextResponse } from "next/server";
import { env } from "@/config/env";

export async function POST() {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    return NextResponse.json(data, { status: response.status });
  }

  return NextResponse.json(data);
}
