/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true,
    },
    serverActions: {
        bodySizeLimit: "10mb",
    },
};
module.exports = nextConfig;
