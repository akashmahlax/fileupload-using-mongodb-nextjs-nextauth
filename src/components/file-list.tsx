"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileType, Fullscreen } from "lucide-react"

interface File {
  _id: string
  filename: string
  contentType: string
  uploadDate: string
  length: number
}

export function FileList() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files")
      if (response.ok) {
        const data = await response.json()
        setFiles(data)
      }
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const renderFilePreview = (file: File) => {
    if (file.contentType.startsWith("image/")) {
      return <Image src={`/api/files/${file._id}`} alt={file.filename} className="w-20 h-20 bg-slate-400  object-cover rounded" width={400} height={400} />
    } else if (file.contentType.startsWith("video/")) {
      return (
        <video className="w-16 h-16 object-cover rounded">
          <source src={`/api/files/${file._id}`} type={file.contentType} />
          Your browser does not support the video tag.
        </video>
      )
    }
    return <FileType className="w-16 h-16 text-gray-400" />
  }

  return (
    <Card className="bg-slate-300">
      <CardHeader>
        <CardTitle className="flex items-center  gap-2">
          <FileType className="w-5 h-5" />
          Uploaded Files
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading files...</p>
        ) : files.length === 0 ? (
          <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file._id} className="flex  border-slate-900 items-center justify-between p-2 rounded-lg border">
                <div className="flex items-center space-x-4">
                  {renderFilePreview(file)}
                  <div className="flex flex-col">
                    <span className="font-medium">{file.filename}</span>
                    <span className="text-sm text-muted-foreground">
                      {file.contentType} • {formatFileSize(file.length)}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{new Date(file.uploadDate).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

