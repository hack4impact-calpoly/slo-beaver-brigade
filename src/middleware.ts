import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: [
        "/",
        "/admin",
        "/dashboard",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
    ],
    ignoredRoutes: ["/(api|trpc)(.*)"],
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
