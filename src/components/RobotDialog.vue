<template>
  <div>
    <div class="mx-4">
      <v-row>
        <v-col>
          <h5>
            n Robot:
            <span class="red--text"></span>
          </h5>
          <h5>
            n dekat bola:
            <span class="red--text"></span>
          </h5>
          <h5>
            n dapat bola:
            <span class="red--text"></span>
          </h5>
          <h5>
            bola global:
            <span class="red--text">
              <span class="black--text">||</span>
            </span>
            <span class="blue--text"> </span>
          </h5>
        </v-col>
        <v-col>
          <h5>timer : <span></span></h5>
          <h5>
            status :
            <span></span>
          </h5>
          <h5>
            umpan x :
            <span></span>
          </h5>
          <h5>
            umpan y :
            <span></span>
          </h5>
        </v-col>
      </v-row>
    </div>
    <v-card class="mx-0 my-2">
      <!-- <v-simple-table> -->
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
            <td style="font-size: 10px">Condition</td>
            <td style="font-size: 10px"></td>
          </tr>

          <tr>
            <td style="font-size: 10px">Odometry</td>
          </tr>
          <tr>
            <td style="font-size: 10px">Status Bola</td>
          </tr>
          <tr>
            <td style="font-size: 10px">Posisi Bola</td>
          </tr>
          <tr>
            <td style="font-size: 10px">Status Algo</td>
          </tr>
          <tr>
            <td style="font-size: 10px">Sub Algo</td>
          </tr>
          <tr>
            <td style="font-size: 10px">Sub^ Algo</td>
          </tr>
          <tr>
            <td style="font-size: 10px">Sub^^ Algo</td>
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
      <!-- </v-simple-table> -->
    </v-card>
  </div>
</template>
<script>
import { useRobot, useLogicUI } from "../stores/store";

export default {
  setup() {
    const UI_LOGIC_STATE = useLogicUI();
    return {
      UI_LOGIC_STATE,
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
