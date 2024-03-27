import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

try {
  connect()
} catch(ex) {
  console.error("Database connection could not be established! ", ex)
}

export async function GET(request: NextRequest) { 
  try {
    const response = NextResponse.json({
      message: "Logged out successfully!",
      success: true
    })

    response.cookies.set("token", "", {
      httpOnly:true,
      expires: new Date(0)
    })

    return response
  } catch(ex:any) {
    NextResponse.json({error: ex.message}, {status: 500})
  }
}