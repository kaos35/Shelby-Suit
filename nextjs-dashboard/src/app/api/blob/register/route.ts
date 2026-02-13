import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { blobId, txHash } = body

        if (!blobId || !txHash) {
            return NextResponse.json(
                { error: 'Missing blobId or txHash' },
                { status: 400 }
            )
        }

        store.updateBlobOnChain(blobId, txHash)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('On-chain registration API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
