const { withSuperjson } = require('next-superjson');

const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
};

module.exports = withSuperjson()(nextConfig);
