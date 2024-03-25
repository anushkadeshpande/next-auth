import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from "next/server";


connect()

export async function POST(request: NextRequest) {
  try {
    const reqBody = request.json()
    const { username, email, password }: any = reqBody

    // TODO: validation
    console.log(reqBody)

    // check if user already exists
    const user = await User.findOne({email})
    
    if(user) {
      NextResponse.json({error: "User already exists!"}, {status: 400})
    } else {
      
    }
  } catch(ex: any) {
    return NextResponse.json({ex: ex.message}, {status: 500})
  }
  
}