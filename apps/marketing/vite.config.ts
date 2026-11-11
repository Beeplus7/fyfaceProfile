import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const certDir = path.resolve(__dirname, '.certs')
const cert = path.join(certDir, 'dev-cert.pem')
const key = path.join(certDir, 'dev-key.pem')
const https =
  fs.existsSync(cert) && fs.existsSync(key)
    ? { cert: fs.readFileSync(cert), key: fs.readFileSync(key) }
    : undefined

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
    https,
  },
})
