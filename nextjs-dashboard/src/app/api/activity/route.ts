import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'

export async function GET(request: NextRequest) {
    console.log('GET /api/activity hit')
    try {
        return NextResponse.json(store.activities)
    } catch (error) {
        console.error('Activity retrieval error:', error)
        return NextResponse.json(
            { error: 'Failed to retrieve activities' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { type, message, status } = body

        if (!type || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        store.addActivity({
            type: type || 'system',
            message,
            status: status || 'info'
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Activity creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create activity' },
            { status: 500 }
        )
    }
}
