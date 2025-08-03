/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['undici'],
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;
    
    // Add a custom resolver for undici
    config.resolve.alias['undici'] = 'undici';
    
    // Add a rule to handle the undici module
    config.module.rules.push({
      test: /node_modules\/undici/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            '@babel/plugin-transform-private-methods',
            '@babel/plugin-transform-class-properties',
            '@babel/plugin-transform-private-property-in-object'
          ]
        }
      }
    });
    return config;
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
}

export default nextConfig;