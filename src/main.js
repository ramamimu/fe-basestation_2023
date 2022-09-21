import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { loadFonts } from "./plugins/webfontloader";
import VueKonva from "vue-konva";
import "@/style.css";
import "flowbite";

loadFonts();

createApp(App).use(VueKonva).use(createPinia()).use(router).mount("#app");
