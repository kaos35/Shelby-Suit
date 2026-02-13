import { NextRequest, NextResponse } from 'next/server'
import { store } from '@/lib/store'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accountName = searchParams.get('name')

    if (accountName) {
      const account = store.accounts.find(acc => acc.name === accountName)
      if (account) {
        return NextResponse.json(account)
      } else {
        return NextResponse.json(
          { error: 'Account not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(store.accounts)
  } catch (error) {
    console.error('Account retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve accounts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const newAccount = {
      id: Date.now().toString(),
      name: body.name,
      address: `0x${Math.random().toString(16).slice(2, 34)}`, // Generated address
      balance: '0.00 SHELBY',
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    }

    store.addAccount(newAccount)
    return NextResponse.json(newAccount, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
