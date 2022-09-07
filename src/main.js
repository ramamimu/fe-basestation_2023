import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import VueKonva from "vue-konva";
loadFonts();

createApp(App)
  .use(VueKonva)
  .use(createPinia())
  .use(router)
  .use(vuetify)
  .mount("#app");
