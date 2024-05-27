import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@database/db";
import User, { IUser } from "@database/userSchema";

import { NextResponse, type NextRequest } from "next/server";

export default authMiddleware({
    publicRoutes: [
        "/",
        "/events/:id/digitalWavier/1",
        "/dashboard",
        "/events/:id/digitalWaiver/2",
        "/events/(.*)",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/calendar",
        "/api/user",
        "/api/user/:email",
        "/api/events",
        "/api/waiver",
        "/api/events/:id",
        "/(api|trpc)(.*)",
    ],
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
