import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import VCalendar from 'v-calendar';  
import 'v-calendar/dist/style.css';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(VCalendar, {});
app.use(VueSweetalert2)
app.use(PrimeVue);
app.use(createPinia())
app.use(router)
app.mount('#app')
