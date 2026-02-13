import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'

export async function GET(request: NextRequest) {
  console.log('GET /api/blob hit')
  try {
    const { searchParams } = new URL(request.url)
    const blobId = searchParams.get('id')

    if (blobId) {
      const blob = store.blobs.find(b => b.id === blobId)
      if (blob) {
        return NextResponse.json(blob)
      } else {
        return NextResponse.json(
          { error: 'Blob not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(store.blobs)
  } catch (error) {
    console.error('Blob retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve blobs' },
      { status: 500 }
    )
  }
}
