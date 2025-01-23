import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ message: "Content is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    const result = await db.collection("posts").insertOne({
      userId: new ObjectId(session.user.id),
      content,
      likes: [],
      comments: [],
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "Post created successfully", postId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Post creation error:", error)
    return NextResponse.json({ message: "An error occurred while creating the post" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()

    const posts = await db.collection("posts").find().sort({ createdAt: -1 }).limit(20).toArray()

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Fetching posts error:", error)
    return NextResponse.json({ message: "An error occurred while fetching posts" }, { status: 500 })
  }
}

