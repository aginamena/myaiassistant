import {Posts, Users} from "@/lib/models";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const session = await getServerSession()
    const {document, filter, collection} = await request.json();
    if(session?.user){
        const requiredCollection = collection === "Posts"  ? Posts : Users
        await requiredCollection.updateOne(filter, {$set: document}, {upsert : true})
    }
    return NextResponse.json({ message: "Update saved successfully" });
}

//gets user profile
export async function GET() {
    await mongoose.connect(process.env.MONGODB_URI as string);
     const session = await getServerSession()
     let profile = null
      if(session?.user){
        profile = await Users.findOne({email:session.user.email})
      }
    return NextResponse.json({ profile });
}