import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    // This function is currently empty, but you can implement your logic here
    const body = await request.json();
    console.log("Received data:", body);
    return NextResponse.json({ message: "User profile saved successfully" });
}