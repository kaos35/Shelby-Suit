import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const accountName = formData.get('accountName') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // In a real system, we would upload to S3/MinIO here.
    // Since we don't have storage configured, we simulate storage by just metadata.
    // But this updates the REAL application state in memory.

    const blobId = Math.random().toString(36).substring(2, 15)

    const newBlob = {
      id: blobId,
      fileName: file.name,
      fileSize: file.size,
      accountName: accountName || 'Default',
      uploadedAt: new Date().toISOString(),
      hash: 'pending-hash', // Would be calculated in real system
      metadata: {
        type: file.type,
      }
    }

    store.addBlob(newBlob)

    return NextResponse.json({
      success: true,
      blobId,
      message: 'File metadata stored successfully'
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
