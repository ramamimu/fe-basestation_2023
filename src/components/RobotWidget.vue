<template>
  <v-card class="mx-auto" width="270">
    <v-row class="ma-0 pa-0">
      <v-col md="4" class="ma-0 pa-0 align-self-start">
        <div title="More Info" style="cursor: pointer">
          <v-card-title class="caption px-3 py-1">
            Robot {{ robot_order + 1 }}
          </v-card-title>
          <v-card-title
            class="caption px-3 py-1"
            :class="{
              error:
                !ROBOT_STATE.ui_to_server.status_control_robot[robot_order],
              'white--text':
                !ROBOT_STATE.ui_to_server.status_control_robot[robot_order],
              'green--text':
                ROBOT_STATE.ui_to_server.status_control_robot[robot_order],
            }"
            @click="show = !show"
          >
            {{
              ROBOT_STATE.ui_to_server.status_control_robot[robot_order]
                ? "Linked"
                : "Unlinked"
            }}
          </v-card-title>
        </div>
      </v-col>
      <v-col md="8" class="ma-0 pa-0 align-self-center">
        <v-container class="mx-0 pa-2 caption">
          <v-btn> CONTROL BOX </v-btn>
        </v-container>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-card flat color="transparent">
      <v-card-text>
        <v-row>
          <v-col class="px-3 ma-0 align-self-center" md="3"
            ><h6>Velocity</h6></v-col
          >
          <v-col class="pa-0 ma-0" md="9">
            <v-slider
              v-model="
                ROBOT_STATE.ui_to_server.trim_kecepatan_robot[robot_order]
              "
              class="align-center"
              :max="max"
              :min="min"
              hide-details
              height="0"
            >
              <template v-slot:append>
                <v-text-field
                  v-model="
                    ROBOT_STATE.ui_to_server.trim_kecepatan_robot[robot_order]
                  "
                  class="mt-0 pt-0 caption"
                  hide-details
                  single-line
                  type="number"
                  style="width: 35px"
                ></v-text-field>
              </template>
            </v-slider>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!--  -->
    <v-card flat color="transparent">
      <v-card-text>
        <v-row>
          <v-col class="px-3 ma-0 align-self-center" md="3"
            ><h6>Sudut</h6></v-col
          >
          <v-col class="pa-0 ma-0" md="9">
            <v-slider
              v-model="
                ROBOT_STATE.ui_to_server.trim_kecepatan_sudut_robot[robot_order]
              "
              class="align-center"
              max="20"
              min="0"
              hide-details
              height="0"
            >
              <template v-slot:append>
                <v-text-field
                  v-model="
                    ROBOT_STATE.ui_to_server.trim_kecepatan_sudut_robot[
                      robot_order
                    ]
                  "
                  class="mt-0 pt-0 caption"
                  hide-details
                  single-line
                  type="number"
                  style="width: 35px"
                ></v-text-field>
              </template>
            </v-slider>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- slider -->
    <v-card flat color="transparent">
      <v-card-text>
        <v-row>
          <v-col class="px-3 ma-0 align-self-center" md="3"
            ><h6>Shoot</h6></v-col
          >
          <v-col class="pa-0 ma-0" md="9">
            <v-slider
              v-model="
                ROBOT_STATE.ui_to_server.trim_penendang_robot[robot_order]
              "
              class="align-center"
              hide-details
              height="0"
              :max="maxShoot"
              :min="minShoot"
            >
              <template v-slot:append>
                <v-text-field
                  v-model="
                    ROBOT_STATE.ui_to_server.trim_penendang_robot[robot_order]
                  "
                  class="mt-0 pt-0 caption"
                  hide-details
                  single-line
                  type="number"
                  style="width: 35px"
                ></v-text-field>
              </template>
            </v-slider>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-expand-transition>
      <div>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-simple-table>
          <template v-slot:default>
            <thead style="font-size: 10px">
              <tr>
                <th class="text-left black--text">Var\Robot</th>
                <th class="text-left" style="font-size: 10px">
                  Robot {{ robot_order + 1 }}
                </th>
              </tr>
            </thead>
            <tbody style="font-size: 10px">
              <tr>
                <td style="font-size: 10px">Robot Teman</td>
                <td style="font-size: 10px">
                  {{ ROBOT_STATE.robot[robot_order].self_data.n_robot_teman }}
                </td>
              </tr>
              <tr>
                <td style="font-size: 10px">Kecepatan robot</td>
                <td style="font-size: 10px">
                  {{
                    ROBOT_STATE.ui_to_server.trim_kecepatan_robot[robot_order]
                  }}
                </td>
              </tr>
              <tr>
                <td style="font-size: 10px">Sudut Robot</td>
                <td style="font-size: 10px">
                  {{
                    ROBOT_STATE.ui_to_server.trim_kecepatan_sudut_robot[
                      robot_order
                    ]
                  }}
                </td>
              </tr>
              <tr>
                <td style="font-size: 10px">Penendang Robot</td>
                <td style="font-size: 10px">
                  {{
                    ROBOT_STATE.ui_to_server.trim_penendang_robot[robot_order]
                  }}
                </td>
              </tr>
              <tr>
                <td style="font-size: 10px">Epoch</td>
                <td style="font-size: 10px">
                  {{ ROBOT_STATE.robot[robot_order].pc2bs_data.epoch }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import { useRobot } from "../stores/store";

export default {
  setup() {
    const ROBOT_STATE = useRobot();
    return {
      ROBOT_STATE,
    };
  },
  props: {
    robot_order: Number,
  },
  data() {
    return {
      show: false,
      min: 0,
      max: 50,
      minShoot: 0,
      maxShoot: 10,
      slider: 40,
    };
  },
};
</script>
