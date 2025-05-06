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
    loader: 'jsx', // این خط مهمه 👇
    include: /src\/.*\.js$/, // فقط فایل‌های .js داخل src
  },
  server: {
    port: 3000,
  }
})
