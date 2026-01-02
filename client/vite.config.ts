// vite.config.js me yeh hona chahiye:
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://bbl-project-2.onrender.com',  // Deployed backend URL
        changeOrigin: true,
        secure: true,
      }
    }
  }
}
