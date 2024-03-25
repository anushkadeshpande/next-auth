import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'

try {
  connect()
} catch(ex) {
  console.error("Database connection could not be established! ", ex)
}
export async function POST(request: NextRequest) {
  try {
    const reqBody = request.json()
    const { username, email, password }: any = reqBody

    // TODO: validation
    console.log(reqBody)

    // check if user already exists
    const user = await User.findOne({email})
    
    if(user) {
      return NextResponse.json({error: "User already exists!"}, {status: 400})
    } 

    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = await bcryptjs.hash(password, salt)

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })

    const savedUser = await newUser.save()

    console.log(savedUser)

    // TODO: Send verification email
  } catch(ex: any) {
    return NextResponse.json({ex: ex.message}, {status: 500})
  }
  
}