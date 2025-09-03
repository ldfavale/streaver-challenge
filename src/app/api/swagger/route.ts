import { NextResponse } from 'next/server'
import { getSwaggerSpec } from '@/lib/get-swagger-spec'

export async function GET() {
  const spec = getSwaggerSpec()
  return NextResponse.json(spec)
}
