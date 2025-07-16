import Users from "@/lib/models";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const session = await getServerSession()
    const body = await request.json();
    if(session?.user){
       await Users.updateOne({email:session.user.email}, {$set: body})
    }
    return NextResponse.json({ message: "User profile saved successfully" });
}