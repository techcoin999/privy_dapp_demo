import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['path', 'stream', 'util', 'crypto', 'buffer', 'process'],
      exclude: ['http'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
      util: 'util',
      // Fix noble/hashes and curves issues with comprehensive aliasing
      '@noble/hashes/blake3': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/hashes/utils': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/hashes/sha256': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/hashes/sha3': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/hashes/sha2': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/hashes/ripemd160': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/hashes/hmac': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/hashes/_assert': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/hashes/legacy': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/hashes/pbkdf2': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/hashes': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/curves/ed25519': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/curves/secp256k1': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/curves/bls12-381': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/curves/p256': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/curves/p384': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/curves/abstract/utils': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/curves/abstract/modular': '/src/utils/noble-hashes-utils-stub.js',
      '@noble/curves': '/src/utils/noble-hashes-utils-stub.js',
    },
  },
  optimizeDeps: {
    // Force rebuild of problematic dependencies
    force: true,
    include: [
      '@privy-io/react-auth',
      '@solana/wallet-adapter-react',
      '@solana/wallet-adapter-react-ui',
      '@solana/wallet-adapter-wallets',
      '@solana/web3.js',
    ],
    exclude: [
      '@noble/hashes',
      '@noble/curves',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [],
    },
  },
})
