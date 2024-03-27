import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

try {
  connect()
} catch(ex) {
  console.error("Database connection could not be established! ", ex)
}

export async function POST(request: NextRequest) { 
  try {
    // extract data from token
    const userId = await getDataFromToken(request)
    const user = await User.findOne({_id: userId}).select("-password")

    return NextResponse.json({
      message: "User Found",
      data: user
    })
  } catch(ex:any) {
    NextResponse.json({error: ex.message}, {status: 500})
  }
}