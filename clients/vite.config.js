import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  // server: {
  //   allowedHosts: ['2bf0b5e2e642.ngrok-free.app',
  //     '192.168.1.2:5173'
  //   ]
  // }
})