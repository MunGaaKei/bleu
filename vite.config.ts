import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
       //port: 3000,
       //open: true,
       proxy: {
         '/netapi': {
             target: 'https://net-music-api-three.vercel.app',    // 目标接口前缀
             //ws: true,       //  代理webscoked
             changeOrigin: true,   // 开启跨域
             rewrite: (path) => path.replace(/^\/netapi/, '')  // 路径重写
         }
       }
     }
})
