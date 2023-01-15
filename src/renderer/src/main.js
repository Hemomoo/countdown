import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "tailwindcss/tailwind.css";
import 'virtual:svg-icons-register'
createApp(App).use(router).mount('#app')
