import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@database/db";
import User, { IUser } from "@database/userSchema";

import { NextResponse, type NextRequest } from "next/server";

export default authMiddleware({
    publicRoutes: [
        "/",
        "/:id/digitalWavier/1",
        "/:id/digitalWaiver/2",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/calendar",
        "/api/user",
        "/api/events",
        "/api/waiver",
        "/api/events/:id",
        "/(api|trpc)(.*)",
    ],
});
/**
 * "/(api|trpc)(.*)"
 */

/**
 * 
 * afterAuth: async (auth, req, evt) => {
        // Handle users who aren't authenticated
        if (!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({ returnBackUrl: req.url });
        }
        // If the user is logged in and trying to access a protected route, allow them to access route
        if (auth.userId && !auth.isPublicRoute) {
            const dbId = auth.user?.publicMetadata["dbId"] || null;
            if (!dbId) {
                return NextResponse.redirect("/");
            } else {
                /** get user role from mongoose */

/**
                try {
                    await connectDB();
                    const usr: IUser = await User.findById(dbId).orFail();
                    if (usr.role == "admin") {
                        return NextResponse.next();
                    }
                } catch {
                    return NextResponse.redirect("/");
                }
            }
        }
        // Allow users visiting public routes to access them
        return NextResponse.next();
    } 
 *
 */

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
