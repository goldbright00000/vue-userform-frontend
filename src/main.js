import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import Vuelidate from "vuelidate";
import { VueMaskDirective } from "v-mask";
import App from "./App.vue";
import "./registerServiceWorker";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Vuelidate);

Vue.directive("mask", VueMaskDirective);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
