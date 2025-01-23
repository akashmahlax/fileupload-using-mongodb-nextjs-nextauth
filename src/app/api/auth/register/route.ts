import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hash } from "bcrypt"

export async function POST(request: NextRequest) {
  try {
    const { name, email, username, phone, password } = await request.json()

    // Validate input
    if (!name || !email || !username || !phone || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Check if email, username or phone already exists
    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { username }, { phone }],
    })

    if (existingUser) {
      return NextResponse.json({ message: "Email, username or phone number already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const result = await db.collection("users").insertOne({
      name,
      email,
      username,
      phone,
      password: hashedPassword,
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "User created successfully", userId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}

