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
      bs2pc_data: {
        header: 105,
        command: 83,
        style: 65,
        bola_x_pada_lapangan: 112,
        bola_y_pada_lapangan: 221,
        auto_kalibrasi: 0,
        odometry_offset_robot: {
          x: 0,
          y: 0,
          theta: 0,
        },
        target_manual: {
          x: 0,
          y: 0,
          theta: 0,
        },
        data_n_robot_mux_1: 44816,
        data_n_robot_mux_2: 44813,
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
  methods: {
    interruptMsg(index) {
      console.log("test");
      SocketioService.setIndex(index);
      SocketioService.emitMessage();
    },
    setHeader() {
      SocketioService.socket.emit("setHeader", this.bs2pc_data.header);
    },
    // command: 83,
    setCommand() {
      SocketioService.socket.emit("setCommand", this.bs2pc_data.command);
    },
    // style: 65,
    setStyle() {
      SocketioService.socket.emit("setStyle", this.bs2pc_data.style);
    },
    // bola_x_pada_lapangan: 112,
    setBolaXPadaLapangan() {
      SocketioService.socket.emit(
        "setBolaXPadaLapangan",
        this.bs2pc_data.bola_x_pada_lapangan
      );
    },
    // bola_y_pada_lapangan: 221,
    setBolaYPadaLapangan() {
      SocketioService.socket.emit(
        "setBolaYPadaLapangan",
        this.bs2pc_data.bola_y_pada_lapangan
      );
    },
    // auto_kalibrasi: 0,
    setAutoKalibrasi() {
      SocketioService.socket.emit(
        "setAutoKalibrasi",
        this.bs2pc_data.auto_kalibrasi
      );
    },
    // odometry_offset_robot: {
    //   x: 0,
    //   y: 0,
    //   theta: 0,
    // },
    setOdometryOffsetRobotX() {
      SocketioService.socket.emit(
        "setOdometryOffsetRobotX",
        this.bs2pc_data.odometry_offset_robot.x
      );
    },
    setOdometryOffsetRobotY() {
      SocketioService.socket.emit(
        "setOdometryOffsetRobotY",
        this.bs2pc_data.odometry_offset_robot.y
      );
    },
    setOdometryOffsetRobotTheta() {
      SocketioService.socket.emit(
        "setOdometryOffsetRobotTheta",
        this.bs2pc_data.odometry_offset_robot.theta
      );
    },
    // target_manual: {
    //   x: 0,
    //   y: 0,
    //   theta: 0,
    // },
    setTargetManualX() {
      SocketioService.socket.emit(
        "setTargetManualX",
        this.bs2pc_data.target_manual.x
      );
    },
    setTargetManualY() {
      SocketioService.socket.emit(
        "setTargetManualY",
        this.bs2pc_data.target_manual.y
      );
    },
    setTargetManualTheta() {
      SocketioService.socket.emit(
        "setTargetManualTheta",
        this.bs2pc_data.target_manual.theta
      );
    },
    // data_n_robot_mux_1: 44816,
    setDataNRobotMux1() {
      SocketioService.socket.emit(
        "setDataNRobotMux1",
        this.bs2pc_data.data_n_robot_mux_1
      );
    },
    // data_n_robot_mux_2: 44813,
    setDataNRobotMux2() {
      SocketioService.socket.emit(
        "setDataNRobotMux2",
        this.bs2pc_data.data_n_robot_mux_2
      );
    },
    // trim_kecepatan_robot1: 25,
    setTrimKecepatanRobot1() {
      SocketioService.socket.emit(
        "setTrimKecepatanRobot1",
        this.bs2pc_data.trim_kecepatan_robot1
      );
    },
    // trim_kecepatan_robot2: 25,
    setTrimKecepatanRobot2() {
      SocketioService.socket.emit(
        "setTrimKecepatanRobot2",
        this.bs2pc_data.trim_kecepatan_robot2
      );
    },
    // trim_kecepatan_robot3: 25,
    setTrimKecepatanRobot3() {
      SocketioService.socket.emit(
        "setTrimKecepatanRobot3",
        this.bs2pc_data.trim_kecepatan_robot3
      );
    },
    // trim_kecepatan_robot4: 25,
    setTrimKecepatanRobot4() {
      SocketioService.socket.emit(
        "setTrimKecepatanRobot4",
        this.bs2pc_data.trim_kecepatan_robot4
      );
    },
    // trim_kecepatan_robot5: 25,
    setTrimKecepatanRobot5() {
      SocketioService.socket.emit(
        "setTrimKecepatanRobot5",
        this.bs2pc_data.trim_kecepatan_robot5
      );
    },
    // trim_kecepatan_sudut_robot1: 25,
    setTrimKecepatanSudutRobot1() {
      SocketioService.socket.emit(
        "setTrimKecepatanSudutRobot1",
        this.bs2pc_data.trim_kecepatan_sudut_robot1
      );
    }, // trim_kecepatan_sudut_robot2: 25,
    setTrimKecepatanSudutRobot2() {
      SocketioService.socket.emit(
        "setTrimKecepatanSudutRobot2",
        this.bs2pc_data.trim_kecepatan_sudut_robot2
      );
    },
    // trim_kecepatan_sudut_robot3: 25,
    setTrimKecepatanSudutRobot3() {
      SocketioService.socket.emit(
        "setTrimKecepatanSudutRobot3",
        this.bs2pc_data.trim_kecepatan_sudut_robot3
      );
    },
    // trim_kecepatan_sudut_robot4: 25,
    setTrimKecepatanSudutRobot4() {
      SocketioService.socket.emit(
        "setTrimKecepatanSudutRobot4",
        this.bs2pc_data.trim_kecepatan_sudut_robot4
      );
    },
    // trim_kecepatan_sudut_robot5: 25,
    setTrimKecepatanSudutRobot5() {
      SocketioService.socket.emit(
        "setTrimKecepatanSudutRobot5",
        this.bs2pc_data.trim_kecepatan_sudut_robot5
      );
    },
    // trim_penendang_robot1: 2,
    setTrimPenendangRobot1() {
      SocketioService.socket.emit(
        "setTrimPenendangRobot1",
        this.bs2pc_data.trim_penendang_robot1
      );
    },
    // trim_penendang_robot2: 2,
    setTrimPenendangRobot2() {
      SocketioService.socket.emit(
        "setTrimPenendangRobot2",
        this.bs2pc_data.trim_penendang_robot2
      );
    },
    // trim_penendang_robot3: 2,
    setTrimPenendangRobot3() {
      SocketioService.socket.emit(
        "setTrimPenendangRobot3",
        this.bs2pc_data.trim_penendang_robot3
      );
    },
    // trim_penendang_robot4: 2,
    setTrimPenendangRobot4() {
      SocketioService.socket.emit(
        "setTrimPenendangRobot4",
        this.bs2pc_data.trim_penendang_robot4
      );
    },
    // trim_penendang_robot5: 2,
    setTrimPenendangRobot5() {
      SocketioService.socket.emit(
        "setTrimPenendangRobot5",
        this.bs2pc_data.trim_penendang_robot5
      );
    },
  },
  mounted() {
    let that = this;
    // setInterval(() => {
    //   SocketioService.emitMessage();
    // }, 100);

    SocketioService.socket.on("sub message", (item1) => {
      console.log(`${new Date().getTime()} => ${item1}`);
      this.UDP.counter = item1;
      console.log(item1.header);
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
    <p>{{ coba }}</p>
    <br />
    <p>{{ socket }}</p>
    <br />
    <p>Message from server UDP</p>
    <p>{{ UDP.counter }}</p>
    <br />
    <button @click="interruptMsg(0)">test index 0</button>
    <button @click="interruptMsg(1)">test index 1</button>
    <button @click="interruptMsg(2)">test index 2</button>
    <button @click="interruptMsg(3)">test index 3</button>
    <button @click="interruptMsg(4)">test index 4</button>
  </div>
  <!-- <RouterView /> -->
  <input type="number" v-model="bs2pc_data.header" />
  <button @click="setHeader">Change Header</button>
  <input type="number" v-model="bs2pc_data.command" />
  <button @click="setCommand">Change command</button>
  <input type="number" v-model="bs2pc_data.bola_x_pada_lapangan" />
  <button @click="setBolaXPadaLapangan">Change Bola x Pada Lapangan</button>
  <input type="number" v-model="bs2pc_data.bola_y_pada_lapangan" />
  <button>Change Bola y Pada Lapangan</button>
  <input type="number" v-model="bs2pc_data.auto_kalibrasi" />
  <button @click="setAutoKalibrasi">Change auto kalibrasi</button>
  <input type="number" v-model="bs2pc_data.odometry_offset_robot.x" />
  <button @click="setOdometryOffsetRobotX">Change odometry offset x</button>
  <input type="number" v-model="bs2pc_data.odometry_offset_robot.y" />
  <button @click="setOdometryOffsetRobotY">Change odometry offset y</button>
  <input type="number" v-model="bs2pc_data.odometry_offset_robot.theta" />
  <button @click="setOdometryOffsetRobotTheta">
    Change odometry offset theta
  </button>
  <input type="number" v-model="bs2pc_data.target_manual.x" />
  <button @click="setTargetManualX">Change odometry manual x</button>
  <input type="number" v-model="bs2pc_data.target_manual.y" />
  <button @click="setTargetManualY">Change odometry manual y</button>
  <input type="number" v-model="bs2pc_data.target_manual.theta" />
  <button @click="setTargetManualTheta">Change odometry manual theta</button>
  <input type="number" v-model="bs2pc_data.data_n_robot_mux_1" />
  <button @click="setDataNRobotMux1">data_n_robot_mux_1</button>
  <input type="number" v-model="bs2pc_data.data_n_robot_mux_2" />
  <button @click="setDataNRobotMux2">data_n_robot_mux_2</button>
  <input type="number" v-model="bs2pc_data.trim_kecepatan_robot1" />
  <button @click="setTrimKecepatanRobot1">trim_kecepatan_robot1</button>
  <input type="number" v-model="bs2pc_data.trim_kecepatan_robot2" />
  <button @click="setTrimKecepatanRobot2">trim_kecepatan_robot2</button>
  <input type="number" v-model="bs2pc_data.trim_kecepatan_robot3" />
  <button @click="setTrimKecepatanRobot3">trim_kecepatan_robot3</button>
  <input type="number" v-model="bs2pc_data.trim_kecepatan_robot4" />
  <button @click="setTrimKecepatanRobot4">trim_kecepatan_robot4</button>
  <input type="number" v-model="bs2pc_data.trim_kecepatan_robot5" />
  <button @click="setTrimKecepatanRobot5">trim_kecepatan_robot5</button>
  <input type="number" v-model="bs2pc_data.trim_kecepatan_sudut_robot1" />
  <button @click="setTrimKecepatanSudutRobot1">
    trim_kecepatan_sudut_robot1
  </button>
  <input type="number" v-model="bs2pc_data.trim_kecepatan_sudut_robot2" />
  <button @click="setTrimKecepatanSudutRobot2">
    trim_kecepatan_sudut_robot2
  </button>
  <input type="number" v-model="bs2pc_data.trim_kecepatan_sudut_robot3" />
  <button @click="setTrimKecepatanSudutRobot3">
    trim_kecepatan_sudut_robot3
  </button>
  <input type="number" v-model="bs2pc_data.trim_kecepatan_sudut_robot4" />
  <button @click="setTrimKecepatanSudutRobot4">
    trim_kecepatan_sudut_robot4
  </button>
  <input type="number" v-model="bs2pc_data.trim_kecepatan_sudut_robot5" />
  <button @click="setTrimKecepatanSudutRobot5">
    trim_kecepatan_sudut_robot5
  </button>
  <input type="number" v-model="bs2pc_data.trim_penendang_robot1" />
  <button @click="setTrimPenendangRobot1">trim_penendang_robot1</button>
  <input type="number" v-model="bs2pc_data.trim_penendang_robot2" />
  <button @click="setTrimPenendangRobot2">trim_penendang_robot2</button>
  <input type="number" v-model="bs2pc_data.trim_penendang_robot3" />
  <button @click="setTrimPenendangRobot3">trim_penendang_robot3</button>
  <input type="number" v-model="bs2pc_data.trim_penendang_robot4" />
  <button @click="setTrimPenendangRobot4">trim_penendang_robot4</button>
  <input type="number" v-model="bs2pc_data.trim_penendang_robot5" />
  <button @click="setTrimPenendangRobot5">trim_penendang_robot5</button>
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
