const { withSuperjson } = require('next-superjson');

const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
    instrumentationHook: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'js-yaml-loader',
    });

    return config;
  },
};

module.exports = withSuperjson()(nextConfig);
