import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [
        ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
      ]
    }
  })],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
  },
  server: {
    port: 3000,
    host: true
  }
})
