// vite.config.js me yeh hona chahiye:
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',  // Backend ka exact port
        changeOrigin: true,
        secure: false,
      }
    }
  }
}
