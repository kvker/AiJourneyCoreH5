import './assets/main.css'
import { createApp, } from 'vue'
import { createPinia } from 'pinia'
import "tailwindcss/tailwind.css"
import "@/styles/main.css"
import App from './App.vue'
import router from './router'
import { onLoginAnonymous } from '@/services/cloud'

onLoginAnonymous()

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.config.errorHandler = (err, instance, info) => {
  // 处理错误，例如：报告给一个服务
  console.log(err, instance, info)
}

if (process.env.NODE_ENV === 'development') {
  const s = document.createElement('script')
  s.src = '//cdn.bootcdn.net/ajax/libs/eruda/2.3.3/eruda.js'
  document.body.append(s)
  s.onload = () => {
    // @ts-ignore
    window.eruda.init()
  }
}

app.mount('#app')