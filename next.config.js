/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true,
    },
    serverActions: {
        bodySizeLimit: "5mb",
    },
};
module.exports = nextConfig;
