

import { Users } from "@/lib/models";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse,NextRequest } from "next/server";


export async function POST(req:NextRequest) {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const {filter, document}=await req.json()
    await Users.updateOne(filter, {$set :document}, {upsert:true})
    return NextResponse.json({status:"Saved the document successfully"});
}

export async function GET(){
    await mongoose.connect(process.env.MONGODB_URI as string);
    const session = await getServerSession()
    let profile = null
    if(session?.user){
        profile = await Users.findOne({email:session.user.email})
    }
    return NextResponse.json(profile);
}