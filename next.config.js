/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            // {
            //     source: "/",
            //     has: [
            //         {
            //             type: "cookie",
            //             key: "user_role",
            //             value: "admin",
            //         },
            //     ],
            //     // destination: "/admin/events",
            //     destination: "/dashboard",
            // },
            // {
            //     source: "/",
            //     has: [
            //         {
            //             type: "cookie",
            //             key: "user_role",
            //             value: "user",
            //         },
            //     ],
            //     destination: "/dashboard",
            // },
            // {
            //     source: "/",
            //     has: [
            //         {
            //             type: "cookie",
            //             key: "user_role",
            //             // value: "guest",
            //         },
            //     ],
            //     destination: "/dashboard",
            // },
            {
                source: "/",
                missing: [
                    {
                        type: "cookie",
                        key: "user_role",
                    },
                ],
                destination: "/dashboard",
            },
        ];
    },
    async headers() {
        return [
            {
                source: "/api/events/calendar",
                headers: [
                    {
                        key: "Content-Type",
                        value: "text/calendar;charset=utf-8",
                    },
                    {
                        key: "Content-Disposition",
                        value: 'attachment; filename="general_calendar.ics',
                    },
                ],
            },
            {
                source: "/api/user/calendar/[userId]",
                headers: [
                    {
                        key: "Content-Type",
                        value: "text/calendar;charset=utf-8",
                    },
                    {
                        key: "Content-Disposition",
                        value: 'attachment; filename="user_calendar.ics"',
                    },
                ],
            },
        ];
    },
    compiler: {
        styledComponents: true,
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
};
module.exports = nextConfig;
