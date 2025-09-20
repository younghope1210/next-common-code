/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, 
    maxDuration: 10,
    images: {
        remotePatterns: [
            { hostname: 'covers.openlibrary.org', protocol: 'https', port: '' }
        ]
    },
    webpack: (config, { isServer }) => { // 여기에 { isServer }를 추가!
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
        }

        // isServer일 때만 bcrypt를 externals에 추가
        if (isServer) {
            config.externals.push('bcrypt'); // bcrypt 모듈을 외부로 선언
        }

        return config
    },
};

export default nextConfig;
