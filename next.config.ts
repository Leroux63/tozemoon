// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();

const csp = [
  "default-src 'self'",
  // wasm + certaines libs ont besoin de wasm-unsafe-eval (et parfois unsafe-eval)
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' 'unsafe-eval' https://hcaptcha.com https://*.hcaptcha.com https://newassets.hcaptcha.com",
  // iframes hCaptcha
  "frame-src 'self' https://hcaptcha.com https://*.hcaptcha.com https://newassets.hcaptcha.com",
  // workers (three/loader, etc.)
  "worker-src 'self' blob:",
  // fetch/XHR (three loaders, HDRI, blobs)
  "connect-src 'self' blob: https://hcaptcha.com https://*.hcaptcha.com https://newassets.hcaptcha.com https://raw.githack.com",
  // images & textures (incl. blob: + data:)
  "img-src 'self' blob: data: https://hcaptcha.com https://*.hcaptcha.com https://newassets.hcaptcha.com https://raw.githack.com",
  // au cas où tu streames des médias via blob:
  "media-src 'self' blob: data:",
  // styles
  "style-src 'self' 'unsafe-inline'",
  // fonts
  "font-src 'self' data:",
  "object-src 'none'",
  "upgrade-insecure-requests"
].join('; ');

const nextConfig: NextConfig = {
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
    'postprocessing',
    'maath'
  ],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '0' }
        ]
      }
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'hcaptcha.com' },
      { protocol: 'https', hostname: '*.hcaptcha.com' },
      { protocol: 'https', hostname: 'newassets.hcaptcha.com' },
      { protocol: 'https', hostname: 'raw.githack.com' }
    ]
  }
};

export default withNextIntl(nextConfig);
