import Users from "@/lib/models";
import { getQRData, initializeClient, isClientAuthenticated } from "@/lib/whatsapp_web";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const session = await getServerSession()
  if(session?.user){
    const profile = await Users.findOne({email:session.user.email})
    if(profile.connectedToWhatsapp){
        return NextResponse.json({qrData:"" , clientIsAuthenticated: profile.connectedToWhatsapp});
    }
    await initializeClient(profile.id);
  }
  const qrData = getQRData();
  const clientIsAuthenticated = isClientAuthenticated();
  return NextResponse.json({ qrData , clientIsAuthenticated});
}
