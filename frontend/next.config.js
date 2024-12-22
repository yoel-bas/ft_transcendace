module.exports = {
  webpack: (config) => {
    config.infrastructureLogging = {
        level: 'error', // Suppress warnings in build output
    };
    return config;
},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'cdn.intra.42.fr',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'img.stablecog.com',
      },
    ],
  },
  reactStrictMode: false, // Disable React Strict Mode
};