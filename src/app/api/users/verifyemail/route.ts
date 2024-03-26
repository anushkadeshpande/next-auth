import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

try {
  connect()
} catch(ex) {
  console.error("Database connection could not be established! ", ex)
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { token } = reqBody
    console.log(token)

    const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}})

    // if user does not exist
    if(!user) {
      NextResponse.json({error: "Invalid token"}, {status: 500})
    }

    // cleanup
    user.isVerified = true
    user.verifyToken = undefined
    user.verifyTokenExpiry = undefined

    // save
    await user.save()

    return NextResponse.json({message: "Email verified successfully!", success: true}, {status: 200})
  } catch(ex:any) {
    NextResponse.json({error: ex.message}, {status: 500})
  }
}