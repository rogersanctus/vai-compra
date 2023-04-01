import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const hasSession = request.cookies.get('auth-session') !== undefined

  return NextResponse.json({ hasSession }, { status: 200 })
}
