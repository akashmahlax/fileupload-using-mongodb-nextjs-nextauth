import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id, name, email, username, phone } = await request.json()

    if (id !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if email or username already exists for another user
    const existingUser = await db.collection("users").findOne({
      $and: [{ _id: { $ne: new ObjectId(id) } }, { $or: [{ email }, { username }, { phone }] }],
    })

    if (existingUser) {
      return NextResponse.json({ message: "Email, username or phone number already in use" }, { status: 400 })
    }

    // Update user
    await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: { name, email, username, phone } })

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "An error occurred while updating the profile" }, { status: 500 })
  }
}

