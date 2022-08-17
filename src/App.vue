<script>
import axios from "axios";
import io from "socket.io-client";
import SocketioService from "./services/socketio.service.js";

export default {
  setup() {
    let socket;
    const coba = "hehahaha;";

    return {
      socket,
      coba,
    };
  },
  data() {
    return {
      users: "rama",
    };
  },
  methods: {
    interruptMsg(index) {
      console.log("test");
      SocketioService.setIndex(index);
    },
  },
  mounted() {
    setInterval(() => {
      SocketioService.emitMessage();
    }, 100);

    SocketioService.socket.on("sub message", (item1, item2, item3) => {
      console.log(
        `${new Date().getTime()} => ${item1} => ${item2} => ${item3}`
      );
    });
    // reconnectionDelayMax: 10000,
    // this.socket = io();
    // this.setupSocket();
  },
  created() {
    SocketioService.setupSocketConnection();
  },
  beforeUnmount() {
    SocketioService.disconnect();
  },
};
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <!-- <HelloWorld msg="You did it!" /> -->
      <p>test</p>
      <p>{{ coba }}</p>
      <button @click="interruptMsg(0)">test index 0</button>
      <button @click="interruptMsg(1)">test index 1</button>
      <button @click="interruptMsg(2)">test index 2</button>
      <button @click="interruptMsg(3)">test index 3</button>
      <button @click="interruptMsg(4)">test index 4</button>
    </div>
  </header>

  <!-- <RouterView /> -->
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
