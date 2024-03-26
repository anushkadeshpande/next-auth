import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"

try {
  connect()
} catch(ex) {
  console.error("Database connection could not be established! ", ex)
}

export async function POST(request: NextRequest) { 
  try {
    const reqBody = await request.json()
    const { email, password } = reqBody
    console.log(reqBody)

    const user = await User.findOne({email})

    // if user does not exist
    if(!user) {
      NextResponse.json({error: "User does not exist"}, {status: 400})
    }

    // Authenticating the user
    const validPassword = await bcryptjs.compare(password, user.password)

    if(!validPassword) {
      NextResponse.json({error: "Invalid credentials"}, {status: 400})
    }

    // create jwt token
    const tokenPayload = {
      id: user._id,
      username: user.username,
      email: user.email
    }

    const token = await jwt.sign(tokenPayload, process.env.TOKEN_SECRET!, {expiresIn: '1d'})

    const response = NextResponse.json({message: "Logged in successfully!", success: true})

    response.cookies.set("token", token, {
      httpOnly: true
    })

    return response
  } catch(ex:any) {
    NextResponse.json({error: ex.message}, {status: 500})
  }
}