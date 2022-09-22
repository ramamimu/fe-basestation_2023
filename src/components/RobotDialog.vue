<template>
  <div>
    <div class="card">
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
            <span class="black--text">||</span>
          </span>
          <span class="blue--text">
            {{ ROBOT_STATE.global_data_server.bola_y_pada_lapangan }}
          </span>
        </h5>
      </div>
      <div>
        <h5>
          Attacker Left:
          <span class="">
            {{ ROBOT_STATE.global_data_server.n_attacker_left }}
          </span>
        </h5>
        <h5>
          Attacker Right:
          <span class="">
            {{ ROBOT_STATE.global_data_server.n_attacker_right }}
          </span>
        </h5>
        <h5>
          Defender Left:
          <span class="">
            {{ ROBOT_STATE.global_data_server.n_defender_left }}
          </span>
        </h5>
        <h5 class="">
          Defender Right:
          <span>
            {{ ROBOT_STATE.global_data_server.n_defender_right }}
          </span>
        </h5>
      </div>
    </div>
    <table class="w-full rounded-lg bg-white shadow-md">
      <tr>
        <th
          class="cursor-pointer py-2 text-left text-sm text-slate-600"
          @click.stop="UI_LOGIC_STATE.toggleMenu()"
        >
          Var\Robot
        </th>
        <th class="text-sm">1</th>
        <th class="text-sm">2</th>
        <th class="text-sm">3</th>
        <th class="text-sm">4</th>
        <th class="text-sm">5</th>
      </tr>
      <tbody>
        <tr>
          <td style="font-size: 10px" class="px-4 text-left">Role</td>
          <td
            style="font-size: 10px"
            v-for="(item, index) in ROBOT_STATE.robot"
            :key="index"
          >
            {{ item.self_data.role }}
          </td>
        </tr>
        <tr>
          <td s style="font-size: 10px" class="px-4 text-left">
            n robot teman
          </td>
          <td
            style="font-size: 10px"
            v-for="(item, index) in ROBOT_STATE.robot"
            :key="index"
          >
            {{ item.self_data.n_robot_teman }}
          </td>
        </tr>
        <tr>
          <td style="font-size: 10px" class="px-4 text-left">Condition</td>
          <td
            style="font-size: 10px"
            v-for="(item, index) in ROBOT_STATE.robot"
            :key="index"
          >
            {{ item.pc2bs_data.robot_condition }}
          </td>
        </tr>

        <tr>
          <td style="font-size: 10px" class="px-4 text-left">Odometry</td>
          <td
            v-for="(item, index) in ROBOT_STATE.robot"
            :key="index"
            style="font-size: 10px"
          >
            {{ item.pc2bs_data.pos_x }} <br />
            {{ item.pc2bs_data.pos_y }} <br />
            {{ item.pc2bs_data.theta }}
          </td>
        </tr>
        <tr>
          <td style="font-size: 10px" class="px-4 text-left">Status Bola</td>
          <td
            style="font-size: 10px"
            v-for="(item, index) in ROBOT_STATE.robot"
            :key="index"
          >
            {{ item.pc2bs_data.status_bola }}
          </td>
        </tr>
        <tr>
          <td style="font-size: 10px" class="px-4 text-left">Posisi Bola</td>
          <td
            style="font-size: 10px"
            v-for="(item, index) in ROBOT_STATE.robot"
            :key="index"
          >
            {{ item.pc2bs_data.bola_x }} <br />
            {{ item.pc2bs_data.bola_x }}
          </td>
        </tr>
        <tr>
          <td style="font-size: 10px" class="px-4 text-left">Status Algo</td>
          <td
            style="font-size: 10px"
            v-for="(item, index) in ROBOT_STATE.robot"
            :key="index"
          >
            {{ item.pc2bs_data.status_algoritma }}
          </td>
        </tr>
        <tr>
          <td style="font-size: 10px" class="px-4 text-left">Sub Algo</td>
          <td
            style="font-size: 10px"
            v-for="(item, index) in ROBOT_STATE.robot"
            :key="index"
          >
            {{ item.pc2bs_data.status_sub_algoritma }}
          </td>
        </tr>
        <tr>
          <td style="font-size: 10px" class="px-4 text-left">Sub^ Algo</td>
          <td
            style="font-size: 10px"
            v-for="(item, index) in ROBOT_STATE.robot"
            :key="index"
          >
            {{ item.pc2bs_data.status_sub_sub_algoritma }}
          </td>
        </tr>
        <tr>
          <td style="font-size: 10px" class="px-4 text-left">Sub^^ Algo</td>
          <td
            style="font-size: 10px"
            v-for="(item, index) in ROBOT_STATE.robot"
            :key="index"
          >
            {{ item.pc2bs_data.status_sub_sub_sub_algoritma }}
          </td>
        </tr>
        <tr>
          <td style="font-size: 10px" class="px-4 text-left">Error PC</td>
        </tr>
        <tr>
          <td style="font-size: 10px" class="px-4 text-left">Error STM</td>
        </tr>

        <tr>
          <td style="font-size: 10px" class="px-4 text-left">Timeout Error</td>
        </tr>
        <tr>
          <td
            style="font-size: 15px"
            class="px-4 text-left font-bold text-slate-500"
          >
            STYLE
          </td>

          <td
            style="font-size: 15px; cursor: pointer"
            class="orange white--text center"
          >
            A
          </td>
          <td
            style="font-size: 15px; cursor: pointer"
            class="orange white--text center"
          >
            B
          </td>
          <td
            style="font-size: 15px; cursor: pointer"
            class="blue white--text center"
          >
            C
          </td>
          <td
            style="font-size: 15px; cursor: pointer"
            class="green white--text center"
          >
            D
          </td>
          <td
            style="font-size: 15px; cursor: pointer"
            class="pink white--text center"
          >
            E
          </td>
        </tr>
      </tbody>
    </table>
    <!-- </div> -->
    <!-- <div class="mx-4">
      <v-row>
        <v-col>
          <h5>
            n Robot:
            <span class="red--text">
              {{ ROBOT_STATE.global_data_server.n_robot_aktif }}
            </span>
          </h5>
          <h5>
            n dekat bola:
            <span class="red--text">
              {{ ROBOT_STATE.global_data_server.n_robot_dekat_bola }}
            </span>
          </h5>
          <h5>
            n dapat bola:
            <span class="red--text">
              {{ ROBOT_STATE.global_data_server.n_robot_dapat_bola }}
            </span>
          </h5>
          <h5>
            n robot umpan:
            <span class="red--text">
              {{ ROBOT_STATE.global_data_server.n_robot_umpan }}
            </span>
          </h5>
          <h5>
            n robot terima:
            <span class="red--text">
              {{ ROBOT_STATE.global_data_server.n_robot_terima }}
            </span>
          </h5>
          <h5>
            bola global:
            <span class="red--text">
              {{ ROBOT_STATE.global_data_server.bola_x_pada_lapangan }}
              <span class="black--text">||</span>
            </span>
            <span class="blue--text">
              {{ ROBOT_STATE.global_data_server.bola_y_pada_lapangan }}
            </span>
          </h5>
        </v-col>
        <v-col>
          <h5>
            Attacker Left:
            <span class="red--text">
              {{ ROBOT_STATE.global_data_server.n_attacker_left }}
            </span>
          </h5>
          <h5>
            Attacker Right:
            <span class="red--text">
              {{ ROBOT_STATE.global_data_server.n_attacker_right }}
            </span>
          </h5>
          <h5>
            Defender Left:
            <span class="red--text">
              {{ ROBOT_STATE.global_data_server.n_defender_left }}
            </span>
          </h5>
          <h5 class="red--text">
            Defender Right:
            <span>
              {{ ROBOT_STATE.global_data_server.n_defender_right }}
            </span>
          </h5>
        </v-col>
      </v-row>
    </div> -->
    <!-- <v-card class="mx-0 my-2">
      <template v-slot:default>
        <thead>
          <tr>
            <th
              class="text-left"
              style="cursor: pointer"
              @click.stop="UI_LOGIC_STATE.toggleMenu()"
            >
              Var\Robot
            </th>
            <th
              class="text-left green white--text"
              style="font-size: 10px; cursor: pointer"
            >
              1
            </th>
            <th
              class="text-left blue white--text"
              style="font-size: 10px; cursor: pointer"
            >
              2
            </th>
            <th
              class="text-left pink lighten-2 white--text"
              style="font-size: 10px; cursor: pointer"
            >
              3
            </th>
            <th
              class="text-left red darken-1 white--text"
              style="font-size: 10px; cursor: pointer"
            >
              4
            </th>
            <th
              class="text-left yellow white--text"
              style="font-size: 10px; cursor: pointer"
            >
              5
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-size: 10px">Role</td>
            <td
              style="font-size: 10px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.self_data.role }}
            </td>
          </tr>
          <tr>
            <td style="font-size: 10px">n robot teman</td>
            <td
              style="font-size: 10px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.self_data.n_robot_teman }}
            </td>
          </tr>
          <tr>
            <td style="font-size: 10px">Condition</td>
            <td
              style="font-size: 10px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.robot_condition }}
            </td>
          </tr>

          <tr>
            <td style="font-size: 10px">Odometry</td>
            <td
              style="font-size: 10px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.pos_x }} <br />
              {{ item.pc2bs_data.pos_y }} <br />
              {{ item.pc2bs_data.theta }}
            </td>
          </tr>
          <tr>
            <td style="font-size: 10px">Status Bola</td>
            <td
              style="font-size: 10px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.status_bola }}
            </td>
          </tr>
          <tr>
            <td style="font-size: 10px">Posisi Bola</td>
            <td
              style="font-size: 10px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.bola_x }} <br />
              {{ item.pc2bs_data.bola_x }}
            </td>
          </tr>
          <tr>
            <td style="font-size: 10px">Status Algo</td>
            <td
              style="font-size: 10px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.status_algoritma }}
            </td>
          </tr>
          <tr>
            <td style="font-size: 10px">Sub Algo</td>
            <td
              style="font-size: 10px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.status_sub_algoritma }}
            </td>
          </tr>
          <tr>
            <td style="font-size: 10px">Sub^ Algo</td>
            <td
              style="font-size: 10px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.status_sub_sub_algoritma }}
            </td>
          </tr>
          <tr>
            <td style="font-size: 10px">Sub^^ Algo</td>
            <td
              style="font-size: 10px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.status_sub_sub_sub_algoritma }}
            </td>
          </tr>
          <tr>
            <td style="font-size: 10px">Error PC</td>
          </tr>
          <tr>
            <td style="font-size: 10px">Error STM</td>
          </tr>

          <tr>
            <td style="font-size: 10px">Timeout Error</td>
          </tr>
          <tr>
            <td style="font-size: 15px" class="brown white--text center">
              STYLE
            </td>

            <td
              style="font-size: 15px; cursor: pointer"
              class="orange white--text center"
            >
              A
            </td>
            <td
              style="font-size: 15px; cursor: pointer"
              class="orange white--text center"
            >
              B
            </td>
            <td
              style="font-size: 15px; cursor: pointer"
              class="blue white--text center"
            >
              C
            </td>
            <td
              style="font-size: 15px; cursor: pointer"
              class="green white--text center"
            >
              D
            </td>
            <td
              style="font-size: 15px; cursor: pointer"
              class="pink white--text center"
            >
              E
            </td>
          </tr>
        </tbody>
      </template>
    </v-card> -->
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
  methods: {},
};
</script>
