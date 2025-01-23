import type { Metadata } from "next"
import clientPromise from "@/lib/mongodb"
import { FileCard } from "@/components/file-card"

export const metadata: Metadata = {
  title: "Image Gallery",
  description: "View all uploaded images",
}

async function getImages() {
  const client = await clientPromise
  const db = client.db()
  return db
    .collection("fs.files")
    .find({ contentType: { $regex: "^image/" } })
    .toArray()
}

export default async function ImageGallery() {
  const images = await getImages()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Image Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <FileCard key={image._id.toString()} file={image} />
        ))}
      </div>
    </div>
  )
}

