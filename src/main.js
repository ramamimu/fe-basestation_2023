import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
// import VueSocketIO from "vue-socket.io";

// export const SocketInstance = socketio("http://localhost:1234");

const app = createApp(App);

app.use(createPinia());
// app.use(
//   new VueSocketIO({
//     debug: true,
//     connection: "http://localhost:1234",
//   })
// );
app.use(router);

app.mount("#app");
