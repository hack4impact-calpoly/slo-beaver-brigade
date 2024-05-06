/** @type {import('next').NextConfig} */
const nextConfig = {
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
