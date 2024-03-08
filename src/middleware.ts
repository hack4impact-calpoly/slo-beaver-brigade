import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: [
        "/",
        "/admin",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/api/user",
    ],
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
