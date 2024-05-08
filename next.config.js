/** @type {import('next').NextConfig} */
const nextConfig = {
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
