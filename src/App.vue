<script>
import axios from "axios";
import io from "socket.io-client";
import SocketioService from "./services/socketio.service.js";
import { useCounterStore } from "@/stores/counter";

export default {
  setup() {
    let socket;
    const coba = "hehahaha;";

    const UDP = useCounterStore();

    return {
      socket,
      coba,
      UDP,
    };
  },
  data() {
    return {
      users: "rama",
      emitter: {
        SERVER_TO_UI: "server2ui",
        UI_TO_SERVER: "ui2server",
      },

      dynamic_data: {
        robot: [{}, {}, {}, {}, {}],
        bola_x_pada_lapangan: 0,
        bola_y_pada_lapangan: 0,
        n_attacker_left: 0,
        n_attacker_right: 0,
        n_defender_left: 0,
        n_defender_right: 0,
        n_robot_umpan: 0,
        n_robot_terima: 0,
      },

      ui2server_data: {
        header: 105,
        command: 83,
        style: 65,
        auto_kalibrasi: 0,
        n_robot_manual: 0,
        target_manual_x: 0,
        target_manual_y: 0,
        target_manual_theta: 0,
        odometry_offset_robot_x: 0,
        odometry_offset_robot_y: 0,
        odometry_offset_robot_theta: 0,
        trim_kecepatan_robot1: 25,
        trim_kecepatan_robot2: 25,
        trim_kecepatan_robot3: 25,
        trim_kecepatan_robot4: 25,
        trim_kecepatan_robot5: 25,
        trim_kecepatan_sudut_robot1: 25,
        trim_kecepatan_sudut_robot2: 25,
        trim_kecepatan_sudut_robot3: 25,
        trim_kecepatan_sudut_robot4: 25,
        trim_kecepatan_sudut_robot5: 25,
        trim_penendang_robot1: 2,
        trim_penendang_robot2: 2,
        trim_penendang_robot3: 2,
        trim_penendang_robot4: 2,
        trim_penendang_robot5: 2,
      },
    };
  },
  methods: {},
  mounted() {
    const THAT = this;
    const EMITTER = THAT.emitter;
    const UI_TO_SERVER_DATA_ = THAT.ui2server_data;
    setInterval(() => {
      SocketioService.socket.emit(EMITTER.UI_TO_SERVER, UI_TO_SERVER_DATA_);
    }, 100);

    SocketioService.socket.on(EMITTER.SERVER_TO_UI, (item) => {
      console.log("i am connected");
      console.log(item);
      THAT.dynamic_data = item;
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
  </header>
  <div>
    <!-- <HelloWorld msg="You did it!" /> -->
    <br />
    <p>test</p>
    <br />
    <h2>Robot 1</h2>
    <p>{{ dynamic_data.robot[0] }}</p>
    <h2>Robot 2</h2>
    <p>{{ dynamic_data.robot[1] }}</p>
    <h2>Robot 3</h2>
    <p>{{ dynamic_data.robot[2] }}</p>
    <h2>Robot 4</h2>
    <p>{{ dynamic_data.robot[3] }}</p>
    <h2>Robot 5</h2>
    <p>{{ dynamic_data.robot[4] }}</p>
    <h2>bola_x_pada_lapangan</h2>
    <p>{{ dynamic_data.bola_x_pada_lapangan }}</p>
    <h2>bola_y_pada_lapangan</h2>
    <p>{{ dynamic_data.bola_y_pada_lapangan }}</p>
    -->
    <br />
    <p>{{ socket }}</p>
    <br />
    <!-- <p>Message from server UDP</p>
    <p>{{ UDP.counter }}</p>
    <br />
    <button @click="interruptMsg(0)">test index 0</button>
    <button @click="interruptMsg(1)">test index 1</button>
    <button @click="interruptMsg(2)">test index 2</button>
    <button @click="interruptMsg(3)">test index 3</button>
    <button @click="interruptMsg(4)">test index 4</button> -->
    <div>
      <!-- header: 105, command: 83, style: 65, auto_kalibrasi: 0, n_robot_manual: 0,
      odometry_offset_robot_x: 0, odometry_offset_robot_y: 0,
      odometry_offset_robot_theta: 0, trim_kecepatan_robot1: 25,
      trim_kecepatan_robot2: 25, trim_kecepatan_robot3: 25, trim_kecepatan_robot4:
      25, trim_kecepatan_robot5: 25, trim_kecepatan_sudut_robot1: 25,
      trim_kecepatan_sudut_robot2: 25, trim_kecepatan_sudut_robot3: 25,
      trim_kecepatan_sudut_robot4: 25, trim_kecepatan_sudut_robot5: 25,
      trim_penendang_robot1: 2, trim_penendang_robot2: 2, trim_penendang_robot3:
      2, trim_penendang_robot4: 2, trim_penendang_robot5: 2, -->
      <p>header</p>
      <p>{{ ui2server_data.header }}</p>
      <input type="number" v-model="ui2server_data.header" />
      <p>command</p>
      <p>{{ ui2server_data.command }}</p>
      <input type="number" v-model="ui2server_data.command" />
      <p>style</p>
      <p>{{ ui2server_data.style }}</p>
      <input type="number" v-model="ui2server_data.style" />
      <p>auto_kalibrasi</p>
      <p>{{ ui2server_data.auto_kalibrasi }}</p>
      <input type="number" v-model="ui2server_data.auto_kalibrasi" />
      <p>n_robot_manual</p>
      <p>{{ ui2server_data.n_robot_manual }}</p>
      <input type="number" v-model="ui2server_data.n_robot_manual" />
      <p>target_manual_x</p>
      <p>{{ ui2server_data.target_manual_x }}</p>
      <input type="number" v-model="ui2server_data.target_manual_x" />
      <p>target_manual_y</p>
      <p>{{ ui2server_data.target_manual_y }}</p>
      <input type="number" v-model="ui2server_data.target_manual_y" />
      <p>target_manual_theta</p>
      <p>{{ ui2server_data.target_manual_theta }}</p>
      <input type="number" v-model="ui2server_data.target_manual_theta" />

      <p>odometry_offset_robot_x</p>
      <p>{{ ui2server_data.odometry_offset_robot_x }}</p>
      <input type="number" v-model="ui2server_data.odometry_offset_robot_x" />
      <p>odometry_offset_robot_y</p>
      <p>{{ ui2server_data.odometry_offset_robot_y }}</p>
      <input type="number" v-model="ui2server_data.odometry_offset_robot_y" />
      <p>odometry_offset_robot_theta</p>
      <p>{{ ui2server_data.odometry_offset_robot_theta }}</p>
      <input
        type="number"
        v-model="ui2server_data.odometry_offset_robot_theta"
      />
      <p>trim_kecepatan_robot1</p>
      <p>{{ ui2server_data.trim_kecepatan_robot1 }}</p>
      <input type="number" v-model="ui2server_data.trim_kecepatan_robot1" />
      <p>trim_kecepatan_robot2</p>
      <p>{{ ui2server_data.trim_kecepatan_robot2 }}</p>
      <input type="number" v-model="ui2server_data.trim_kecepatan_robot2" />
      <p>trim_kecepatan_robot3</p>
      <p>{{ ui2server_data.trim_kecepatan_robot3 }}</p>
      <input type="number" v-model="ui2server_data.trim_kecepatan_robot3" />
      <p>trim_kecepatan_robot4</p>
      <p>{{ ui2server_data.trim_kecepatan_robot4 }}</p>
      <input type="number" v-model="ui2server_data.trim_kecepatan_robot4" />
      <p>trim_kecepatan_robot5</p>
      <p>{{ ui2server_data.trim_kecepatan_robot5 }}</p>
      <input type="number" v-model="ui2server_data.trim_kecepatan_robot5" />
      <p>trim_kecepatan_sudut_robot1</p>
      <p>{{ ui2server_data.trim_kecepatan_sudut_robot1 }}</p>
      <input
        type="number"
        v-model="ui2server_data.trim_kecepatan_sudut_robot1"
      />
      <p>trim_kecepatan_sudut_robot2</p>
      <p>{{ ui2server_data.trim_kecepatan_sudut_robot2 }}</p>
      <input
        type="number"
        v-model="ui2server_data.trim_kecepatan_sudut_robot2"
      />
      <p>trim_kecepatan_sudut_robot3</p>
      <p>{{ ui2server_data.trim_kecepatan_sudut_robot3 }}</p>
      <input
        type="number"
        v-model="ui2server_data.trim_kecepatan_sudut_robot3"
      />
      <p>trim_kecepatan_sudut_robot4</p>
      <p>{{ ui2server_data.trim_kecepatan_sudut_robot4 }}</p>
      <input
        type="number"
        v-model="ui2server_data.trim_kecepatan_sudut_robot4"
      />
      <p>trim_kecepatan_sudut_robot5</p>
      <p>{{ ui2server_data.trim_kecepatan_sudut_robot5 }}</p>
      <input
        type="number"
        v-model="ui2server_data.trim_kecepatan_sudut_robot5"
      />
      <p>trim_penendang_robot1</p>
      <p>{{ ui2server_data.trim_penendang_robot1 }}</p>
      <input type="number" v-model="ui2server_data.trim_penendang_robot1" />
      <p>trim_penendang_robot2</p>
      <p>{{ ui2server_data.trim_penendang_robot2 }}</p>
      <input type="number" v-model="ui2server_data.trim_penendang_robot2" />
      <p>trim_penendang_robot3</p>
      <p>{{ ui2server_data.trim_penendang_robot3 }}</p>
      <input type="number" v-model="ui2server_data.trim_penendang_robot3" />
      <p>trim_penendang_robot4</p>
      <p>{{ ui2server_data.trim_penendang_robot4 }}</p>
      <input type="number" v-model="ui2server_data.trim_penendang_robot4" />
      <p>trim_penendang_robot5</p>
      <p>{{ ui2server_data.trim_penendang_robot5 }}</p>
      <input type="number" v-model="ui2server_data.trim_penendang_robot5" />
    </div>
  </div>
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
