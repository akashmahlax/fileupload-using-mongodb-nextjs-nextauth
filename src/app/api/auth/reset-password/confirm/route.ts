import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hash } from "bcrypt"

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json()

    const client = await clientPromise
    const db = client.db()

    const user = await db.collection("users").findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpiry: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 })
    }

    const hashedPassword = await hash(newPassword, 10)

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetPasswordOtp: "", resetPasswordOtpExpiry: "" },
      },
    )

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Password reset confirmation error:", error)
    return NextResponse.json({ message: "An error occurred during password reset confirmation" }, { status: 500 })
  }
}

