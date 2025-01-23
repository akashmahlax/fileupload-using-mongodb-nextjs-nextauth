import Link from "next/link"
import { FileUpload } from "@/components/file-upload"
import { FileList } from "@/components/file-list"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">File Upload App</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <FileUpload />
        <FileList />
      </div>
      <div className="mt-8 flex gap-4">
        <Link href="/images">
          <Button>View Image Gallery</Button>
        </Link>
        <Link href="/videos">
          <Button>View Video Gallery</Button>
        </Link>
      </div>
    </main>
  )
}

