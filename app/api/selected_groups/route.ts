

import {  SelectedGroupsToPost } from "@/lib/models";
import mongoose from "mongoose";
import { NextResponse,NextRequest } from "next/server";


export async function POST(req:NextRequest) {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const {filter, document}=await req.json()
    await SelectedGroupsToPost.updateOne(filter, {$set :document}, {upsert:true})
    return NextResponse.json({status:"Saved the document successfully"});
}