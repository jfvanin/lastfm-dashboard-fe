import './assets/base.css'
import './assets/styles.css'

import { createApp } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import App from './App.vue'
import router from './router'
import ToastPlugin from 'vue-toast-notification';
// Import one of the available themes
import 'vue-toast-notification/dist/theme-default.css';
//import 'vue-toast-notification/dist/theme-bootstrap.css';

const app = createApp(App)

app.use(router)
app.use(VueApexCharts);
app.use(ToastPlugin);

app.mount('#app')
