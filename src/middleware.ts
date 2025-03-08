import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

// export default function middleware(req: NextRequest, event: NextFetchEvent) {
//     // Log the API routes that are hit
//     console.log(`Middleware hit: ${req.nextUrl.pathname}`);

//     return clerkMiddleware()(req, event);
// }
export default clerkMiddleware();

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
