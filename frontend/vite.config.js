import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite';
export default ({ mode }) => {

  const env = loadEnv(mode, process.cwd());

  const API_URL = `${env.VITE_API_URL || 'http://localhost:3001'}`;
  // https://vitejs.dev/config/
return defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    proxy: {
    '/api': API_URL,
    }
  }
})
}
