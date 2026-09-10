import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { paymentGatewayPlugin } from './vitePaymentPlugin.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      paymentGatewayPlugin(env),
    ],
  }
})
