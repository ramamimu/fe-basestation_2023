<template>
  <div>
    <div class="card overflow-auto">
      <div>
        <h5>
          n Robot:
          <span class="">
            {{ ROBOT_STATE.global_data_server.n_robot_aktif }}
          </span>
        </h5>
        <h5>
          n dekat bola:
          <span class="">
            {{ ROBOT_STATE.global_data_server.n_robot_dekat_bola }}
          </span>
        </h5>
        <h5>
          n dapat bola:
          <span class="">
            {{ ROBOT_STATE.global_data_server.n_robot_dapat_bola }}
          </span>
        </h5>
        <h5>
          n robot umpan:
          <span class="">
            {{ ROBOT_STATE.global_data_server.n_robot_umpan }}
          </span>
        </h5>
        <h5>
          n robot terima:
          <span class="">
            {{ ROBOT_STATE.global_data_server.n_robot_terima }}
          </span>
        </h5>
        <h5>
          bola global:
          <span class="">
            {{ ROBOT_STATE.global_data_server.bola_x_pada_lapangan }}
            <span class="black--text">|| </span>
          </span>
          <span class="blue--text">
            {{ ROBOT_STATE.global_data_server.bola_y_pada_lapangan }}
          </span>
        </h5>
      </div>
      <div>
        <h5>
          (1)GoalKeeper :
          <span class="">
            {{ getRoleRobot(1) }}
          </span>
        </h5>
        <h5>
          (2)Attacker :
          <span class="">
            {{ getRoleRobot(2) }}
          </span>
        </h5>
        <h5>
          (3)assist :
          <span class="">
            {{ getRoleRobot(3) }}
          </span>
        </h5>
        <h5>
          (4)Defender :
          <span class="">
            {{ getRoleRobot(4) }}
          </span>
        </h5>
        <h5 class="">
          (5)Defender:
          <span>
            {{ getRoleRobot(5) }}
          </span>
        </h5>
      </div>
    </div>
    <div class="card flex overflow-auto">
      <table class="mx-auto w-full rounded-lg bg-white p-0 shadow-md">
        <tr>
          <th
            class="cursor-pointer py-2 text-left text-sm text-slate-600"
            @click.stop="UI_LOGIC_STATE.toggleMenu()"
          >
            Var\Robot
          </th>
          <th
            class="cursor-pointer bg-green-400 text-sm text-white hover:bg-green-500"
          >
            1
          </th>
          <th
            class="cursor-pointer bg-blue-500 text-sm text-white hover:bg-blue-600"
          >
            2
          </th>
          <th
            class="cursor-pointer bg-pink-500 text-sm text-white hover:bg-pink-600"
          >
            3
          </th>
          <th
            class="cursor-pointer bg-red-500 text-sm text-white hover:bg-red-600"
          >
            4
          </th>
          <th
            class="cursor-pointer bg-yellow-300 text-sm text-white hover:bg-yellow-400"
          >
            5
          </th>
        </tr>
        <tbody>
          <tr class="hover:bg-slate-100">
            <td style="font-size: 12px" class="px-4 text-left">Role</td>
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.self_data.role }}
            </td>
          </tr>
          <tr class="hover:bg-slate-100">
            <td s style="font-size: 12px" class="px-4 text-left">
              n robot teman
            </td>
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.self_data.n_robot_teman }}
            </td>
          </tr>
          <tr class="hover:bg-slate-100">
            <td style="font-size: 12px" class="px-4 text-left">Condition</td>
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.robot_condition }}
            </td>
          </tr>
          <tr class="hover:bg-slate-100">
            <td style="font-size: 12px" class="px-4 text-left">Odometry</td>
            <td
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
              style="font-size: 12px"
            >
              {{ item.pc2bs_data.pos_x }} <br />
              {{ item.pc2bs_data.pos_y }} <br />
              {{ item.pc2bs_data.theta }}
            </td>
          </tr>
          <tr class="hover:bg-slate-100">
            <td style="font-size: 12px" class="px-4 text-left">Status Bola</td>
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.status_bola }}
            </td>
          </tr>
          <tr class="hover:bg-slate-100">
            <td style="font-size: 12px" class="px-4 text-left">Posisi Bola</td>
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.bola_x }} <br />
              {{ item.pc2bs_data.bola_y }}
            </td>
          </tr>
          <tr class="hover:bg-slate-100">
            <td style="font-size: 12px" class="px-4 text-left">Status Algo</td>
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.status_algoritma }}
            </td>
          </tr>
          <tr class="hover:bg-slate-100">
            <td style="font-size: 12px" class="px-4 text-left">Sub Algo</td>
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.status_sub_algoritma }}
            </td>
          </tr>
          <tr class="hover:bg-slate-100">
            <td style="font-size: 12px" class="px-4 text-left">Sub^ Algo</td>
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.status_sub_sub_algoritma }}
            </td>
          </tr>
          <tr class="hover:bg-slate-100">
            <td style="font-size: 12px" class="px-4 text-left">Sub^^ Algo</td>
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.status_sub_sub_sub_algoritma }}
            </td>
          </tr>
          <tr>
            <td
              style="font-size: 15px"
              class="bg-yellow-800 px-4 text-left font-bold text-white"
            >
              STYLE
            </td>

            <td
              style="font-size: 15px; cursor: pointer"
              @click="ROBOT_STATE.changeStyle(65)"
              class="orange white--text center bg-green-400 font-bold text-white hover:bg-green-500"
            >
              A
            </td>
            <td
              style="font-size: 15px; cursor: pointer"
              @click="ROBOT_STATE.changeStyle(66)"
              class="orange white--text center bg-blue-500 font-bold text-white hover:bg-blue-600"
            >
              B
            </td>
            <td
              style="font-size: 15px; cursor: pointer"
              @click="ROBOT_STATE.changeStyle(67)"
              class="blue white--text center bg-pink-500 font-bold text-white hover:bg-pink-600"
            >
              C
            </td>
            <td
              style="font-size: 15px; cursor: pointer"
              @click="ROBOT_STATE.changeStyle(68)"
              class="green white--text center bg-red-500 font-bold text-white hover:bg-red-600"
            >
              D
            </td>
            <td
              style="font-size: 15px; cursor: pointer"
              @click="ROBOT_STATE.changeStyle(69)"
              class="pink white--text center bg-yellow-300 font-bold text-white hover:bg-yellow-400"
            >
              E
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { useRobot, useLogicUI } from "../stores/store";

export default {
  setup() {
    const UI_LOGIC_STATE = useLogicUI();
    const ROBOT_STATE = useRobot();
    return {
      UI_LOGIC_STATE,
      ROBOT_STATE,
    };
  },
  data() {
    return {
      robots: ["robot1", "robot2", "robot3", "robot4", "robot5"],
    };
  },
  methods: {
    getRoleRobot(n_role) {
      // 1 Goal Keeper
      // 2 attacker
      // 3 assist
      // 4 defender 1
      // 5 defender 2
      const LEN_ROBOT = this.ROBOT_STATE.robot.length;
      let n_robot_roles = 0;

      for (let i = 0; i < LEN_ROBOT; i++) {
        if (n_role == this.ROBOT_STATE.robot[i].self_data.role)
          n_robot_roles = i + 1;
      }
      return n_robot_roles;
    },
  },
};
</script>
