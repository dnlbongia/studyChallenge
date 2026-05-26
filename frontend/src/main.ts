import { createApp } from 'vue'
import 'katex/dist/katex.min.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { setupMath } from './utils/math'

setupMath()

const app = createApp(App)
app.use(router)
app.mount('#app')
