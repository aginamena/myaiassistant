import { NextResponse } from "next/server";
import { initializeClient, getQRData, isClientAuthenticated } from "@/lib/whatsapp_web";

export async function GET() {
  await initializeClient("users_phone_number");
  const qrData = getQRData();
  const clientIsAuthenticated = isClientAuthenticated();
  return NextResponse.json({ qrData , clientIsAuthenticated});
}
