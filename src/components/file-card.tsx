"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2 } from "lucide-react"

interface FileCardProps {
  file: {
    _id: string
    filename: string
    contentType: string
    length: number
  }
}

export function FileCard({ file }: FileCardProps) {
  const handleDelete = async () => {
    // Implement delete functionality here
    console.log("Delete file:", file._id)
  }

  const handleDownload = () => {
    window.open(`/api/files/${file._id}?download=true`, "_blank")
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {file.contentType.startsWith("image/") ? (
          <img src={`/api/files/${file._id}`} alt={file.filename} className="w-full h-auto object-cover" />
        ) : (
          <video className="w-full h-auto" controls>
            <source src={`/api/files/${file._id}`} type={file.contentType} />
            Your browser does not support the video tag.
          </video>
        )}
        <div className="p-4">
          <p className="text-sm font-medium truncate">{file.filename}</p>
          <div className="flex justify-between items-center mt-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

