import { authMiddleware } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";

export default authMiddleware({
    publicRoutes: [
        "/",
        "/admin",
        "/dashboard",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/api/user",
        "/api/events",
    ],
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
