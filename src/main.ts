import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/assets/globle.scss';
import "tailwindcss/tailwind.css"
import 'element-plus/dist/index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

window.alert=function(...msg:any[]){
  console.log(...msg)
}