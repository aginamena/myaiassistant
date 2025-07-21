import { Posts } from "@/lib/models";
import mongoose from "mongoose";
import { NextResponse,NextRequest } from "next/server";


export async function GET(req:NextRequest) {
    const paths = req.nextUrl.pathname.split("/")
    const postId = paths[paths.length- 1]
    await mongoose.connect(process.env.MONGODB_URI as string);
    const post =await Posts.findOne({id:postId})
    return NextResponse.json(post);
}

export async function POST(req:NextRequest) {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const {filter, document}=await req.json()
    await Posts.updateOne(filter, {$set: document} ,{upsert:true})
    return NextResponse.json({status:"Saved the document successfully"});
}