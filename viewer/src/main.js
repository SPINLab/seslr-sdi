import Vue from 'vue';
import App from './App.vue';
import '@mdi/font/css/materialdesignicons.css';
import Vuebar from 'vuebar';
import Ion from 'cesium/Core/Ion';

Vue.config.productionTip = false;

Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ZWNjNmNiOC0xZDhiLTQ1NTktOGNiZi1jZjE3YzIwMDNkMDMiLCJpZCI6NDk1LCJpYXQiOjE1MjUyNTUyNzV9.R-_alHqdFwfZODeZRMbU3b_Cqakop-X5w2mbtoAS3fA';

Vue.use(Vuebar);

new Vue({
  render: h => h(App)
}).$mount('#app');
