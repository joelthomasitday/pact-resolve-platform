
import { NextRequest, NextResponse } from 'next/server';
import { fetchStrapi } from '@/lib/strapi';

/**
 * Generic proxy for Strapi API requests
 * This keeps the STRAPI_API_TOKEN secret on the server
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const path = segments.join('/');
  const { searchParams } = new URL(request.url);

  try {
    const data = await fetchStrapi(path, searchParams.toString());
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
