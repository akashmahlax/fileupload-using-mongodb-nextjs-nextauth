import type { Metadata } from "next"
import clientPromise from "@/lib/mongodb"
import { FileCard } from "@/components/file-card"

export const metadata: Metadata = {
  title: "Video Gallery",
  description: "View all uploaded videos",
}

async function getVideos() {
  const client = await clientPromise
  const db = client.db()
  return db
    .collection("fs.files")
    .find({ contentType: { $regex: "^video/" } })
    .toArray()
}

export default async function VideoGallery() {
  const videos = await getVideos()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Video Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map((video) => (
          <FileCard key={video._id.toString()} file={video} />
        ))}
      </div>
    </div>
  )
}

