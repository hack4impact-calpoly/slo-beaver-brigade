import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: [
        "/",
        "/admin",
        "/admin/events",
        "/calendar",
        "/dashboard",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
    ],
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
