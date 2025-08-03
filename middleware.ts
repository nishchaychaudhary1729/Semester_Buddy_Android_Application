import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { Ratelimit } from '@upstash/ratelimit';
// import { Redis } from '@upstash/redis';

// Create a new ratelimiter that allows 10 requests per 10 seconds
// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(10, '10 s'),
//   analytics: true,
// });

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // Rate limiting for API routes (commented out for now)
  // if (request.nextUrl.pathname.startsWith('/api/')) {
  //   const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1';
  //   const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  //   response.headers.set('X-RateLimit-Limit', limit.toString());
  //   response.headers.set('X-RateLimit-Remaining', remaining.toString());
  //   response.headers.set('X-RateLimit-Reset', reset.toString());

  //   if (!success) {
  //     return new NextResponse('Too Many Requests', {
  //       status: 429,
  //       headers: {
  //         'Content-Type': 'text/plain',
  //         'X-RateLimit-Limit': limit.toString(),
  //         'X-RateLimit-Remaining': remaining.toString(),
  //         'X-RateLimit-Reset': reset.toString(),
  //       },
  //     });
  //   }
  // }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 