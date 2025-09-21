// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();

// ⚠️ Ajuste la CSP si tu as d'autres scripts/CDN (Analytics, etc.)
const csp = [
  // Base
  "default-src 'self'",
  // hCaptcha charge du JS depuis *.hcaptcha.com + newassets.hcaptcha.com
  // (Si tu as un nonce, préfère 'nonce-xxx' plutôt que 'unsafe-inline')
  "script-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com https://newassets.hcaptcha.com",
  // hCaptcha s’embarque en iframe
  "frame-src 'self' https://hcaptcha.com https://*.hcaptcha.com https://newassets.hcaptcha.com",
  // APIs/accessoires
  "connect-src 'self' https://hcaptcha.com https://*.hcaptcha.com https://newassets.hcaptcha.com",
  // Images (logos hCaptcha, etc.)
  "img-src 'self' data: https://hcaptcha.com https://*.hcaptcha.com https://newassets.hcaptcha.com",
  // Styles (si tu utilises des styles inline ou CDN, ajoute-les ici)
  "style-src 'self' 'unsafe-inline'",
  // Polices si besoin d’un CDN de fonts
  "font-src 'self' data:",
  // Objects (désactivé par sécurité)
  "object-src 'none'",
  // Upgrade HTTP → HTTPS
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
  // 👇 Ajoute les headers (dont la CSP) pour toutes les routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Si tu as déjà une CSP via Vercel/edge, fusionne-les.
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '0' }
        ]
      }
    ];
  },
  // Optionnel : si tu charges des images externes
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'hcaptcha.com' },
      { protocol: 'https', hostname: '*.hcaptcha.com' },
      { protocol: 'https', hostname: 'newassets.hcaptcha.com' }
    ]
  }
};

export default withNextIntl(nextConfig);
