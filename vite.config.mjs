// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import VueRouter from 'unplugin-vue-router/vite'
import commonjs from 'vite-plugin-commonjs'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter(),
    Vue({
      template: { transformAssetUrls },
    }),
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
      // Define light mode as the default theme
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              background: '#F5F5F5',
              surface: '#FFFFFF',
              primary: '#6200EE',
              secondary: '#03DAC6',
              error: '#B00020',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FB8C00',
            },
          },
        },
      },
    }),
    Components({
      dts: true,
    }),
    ViteFonts({
      google: {
        families: [
          {
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900',
          },
        ],
      },
    }),
    commonjs(),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  optimizeDeps: {
    include: ['element-resize-detector'],
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
})