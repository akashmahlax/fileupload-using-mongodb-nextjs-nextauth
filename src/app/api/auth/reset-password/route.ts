import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { randomBytes } from "crypto"
import { sendEmail } from "../../../../lib/email"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    const client = await clientPromise
    const db = client.db()

    const user = await db.collection("users").findOne({ email })

    if (user) {
      const otp = randomBytes(3).toString("hex").toUpperCase()
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // OTP valid for 10 minutes

      await db
        .collection("users")
        .updateOne({ _id: user._id }, { $set: { resetPasswordOtp: otp, resetPasswordOtpExpiry: otpExpiry } })

      // Send email with OTP
      await sendEmail(
        email,
        "Password Reset OTP",
        `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
      )
    }

    // Always return a success message to prevent email enumeration
    return NextResponse.json({ message: "If an account exists for that email, we've sent a password reset OTP." })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ message: "An error occurred during password reset" }, { status: 500 })
  }
}

