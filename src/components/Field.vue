<template>
  <div ref="container">
    <v-stage
      ref="stage"
      :config="FIELD_STATE.stage_config"
      @click="getPosition()"
    >
      <v-layer ref="layer">
        <v-image ref="field" :config="FIELD_STATE.field_config" />

        <template
          v-if="LOGIC_UI_STATE.status_offset || LOGIC_UI_STATE.status_manual"
        >
          <v-image
            ref="robot_offset"
            :config="FIELD_STATE.robot_offset"
          ></v-image>
        </template>
        <!-- SHOOTLINE -->
        <template
          v-if="
            ROBOT_STATE.ui_to_server.status_control_robot[0] &&
            ROBOT_STATE.robot[0].self_data.is_active
          "
        >
          <v-line :config="FIELD_STATE.line_config[0]"></v-line>
        </template>
        <template
          v-if="
            ROBOT_STATE.ui_to_server.status_control_robot[1] &&
            ROBOT_STATE.robot[1].self_data.is_active
          "
        >
          <v-line :config="FIELD_STATE.line_config[1]"></v-line>
        </template>
        <template
          v-if="
            ROBOT_STATE.ui_to_server.status_control_robot[2] &&
            ROBOT_STATE.robot[2].self_data.is_active
          "
        >
          <v-line :config="FIELD_STATE.line_config[2]"></v-line>
        </template>
        <template
          v-if="
            ROBOT_STATE.ui_to_server.status_control_robot[3] &&
            ROBOT_STATE.robot[3].self_data.is_active
          "
        >
          <v-line :config="FIELD_STATE.line_config[3]"></v-line>
        </template>
        <template
          v-if="
            ROBOT_STATE.ui_to_server.status_control_robot[4] &&
            ROBOT_STATE.robot[4].self_data.is_active
          "
        >
          <v-line :config="FIELD_STATE.line_config[4]"></v-line>
        </template>

        <!-- ROBOT & BOLA 1 -->
        <template
          v-if="
            ROBOT_STATE.ui_to_server.status_control_robot[0] &&
            ROBOT_STATE.robot[0].self_data.is_active
          "
        >
          <v-image ref="robot1" :config="FIELD_STATE.robot_config[0]"></v-image>
          <v-image ref="ball1" :config="FIELD_STATE.ball_config[0]"></v-image>
        </template>

        <!-- ROBOT & BOLA 2 -->
        <template
          v-if="
            ROBOT_STATE.ui_to_server.status_control_robot[1] &&
            ROBOT_STATE.robot[1].self_data.is_active
          "
        >
          <v-image ref="robot2" :config="FIELD_STATE.robot_config[1]"></v-image>
          <v-image ref="ball2" :config="FIELD_STATE.ball_config[1]"></v-image>
        </template>

        <!-- ROBOT & BOLA 3 -->
        <template
          v-if="
            ROBOT_STATE.ui_to_server.status_control_robot[2] &&
            ROBOT_STATE.robot[2].self_data.is_active
          "
        >
          <v-image ref="robot3" :config="FIELD_STATE.robot_config[2]"></v-image>
          <v-image ref="ball3" :config="FIELD_STATE.ball_config[2]"></v-image>
        </template>

        <!-- ROBOT & BOLA 4 -->
        <template
          v-if="
            ROBOT_STATE.ui_to_server.status_control_robot[3] &&
            ROBOT_STATE.robot[3].self_data.is_active
          "
        >
          <v-image ref="robot4" :config="FIELD_STATE.robot_config[3]"></v-image>
          <v-image ref="ball4" :config="FIELD_STATE.ball_config[3]"></v-image>
        </template>

        <!-- ROBOT & BOLA 5 -->
        <template
          v-if="
            ROBOT_STATE.ui_to_server.status_control_robot[4] &&
            ROBOT_STATE.robot[4].self_data.is_active
          "
        >
          <v-image ref="robot5" :config="FIELD_STATE.robot_config[4]"></v-image>
          <v-image ref="ball5" :config="FIELD_STATE.ball_config[4]"></v-image>
        </template>

        <!-- obs robot 1 -->
        <template
          v-if="
            ROBOT_STATE.ui_to_server.status_control_robot[0] &&
            ROBOT_STATE.robot[0].self_data.is_active
          "
        >
          <template
            v-for="(obs, index) in ROBOT_STATE.robot[0].pc2bs_data.obs_dist"
            :key="index"
          >
            <v-circle
              :ref="`r1_obs_${index}`"
              :config="obs_robot_1[index]"
            ></v-circle>
          </template>
        </template>

        <!-- obs robot 2 -->
        <template
          v-if="
            ROBOT_STATE.ui_to_server.status_control_robot[1] &&
            ROBOT_STATE.robot[1].self_data.is_active
          "
        >
          <template
            v-for="(obs, index) in ROBOT_STATE.robot[1].pc2bs_data.obs_dist"
            :key="index"
          >
            <v-circle
              :ref="`r2_obs_${index}`"
              :config="obs_robot_2[index]"
            ></v-circle>
          </template>
        </template>

        <!-- obs robot 3 -->
        <template
          v-if="
            ROBOT_STATE.ui_to_server.status_control_robot[2] &&
            ROBOT_STATE.robot[2].self_data.is_active
          "
        >
          <template
            v-for="(obs, index) in ROBOT_STATE.robot[2].pc2bs_data.obs_dist"
            :key="index"
          >
            <v-circle
              :ref="`r3_obs_${index}`"
              :config="obs_robot_3[index]"
            ></v-circle>
          </template>
        </template>

        <!-- obs robot 4 -->
        <template
          v-if="
            ROBOT_STATE.ui_to_server.status_control_robot[3] &&
            ROBOT_STATE.robot[3].self_data.is_active
          "
        >
          <template
            v-for="(obs, index) in ROBOT_STATE.robot[3].pc2bs_data.obs_dist"
            :key="index"
          >
            <v-circle
              :ref="`r4_obs_${index}`"
              :config="obs_robot_4[index]"
            ></v-circle>
          </template>
        </template>

        <!-- obs robot 5 -->
        <template
          v-if="
            ROBOT_STATE.ui_to_server.status_control_robot[4] &&
            ROBOT_STATE.robot[4].self_data.is_active
          "
        >
          <template
            v-for="(obs, index) in ROBOT_STATE.robot[4].pc2bs_data.obs_dist"
            :key="index"
          >
            <v-circle
              :ref="`r5_obs_${index}`"
              :config="obs_robot_5[index]"
            ></v-circle>
          </template>
        </template>
        <v-line ref="line_config" :config="FIELD_STATE.line_point"></v-line>
        <template v-for="(obs, index) in all_texts" :key="index">
          <v-circle
            :ref="`points_${index + 1}`"
            :config="all_points[index]"
            v-if="obs.text == ROBOT_STATE.robot[1].pc2bs_data.index_point"
          ></v-circle>
          <v-text
            v-if="obs.text == ROBOT_STATE.robot[1].pc2bs_data.index_point"
            :ref="`text_${index + 1}`"
            :config="all_texts[index]"
          ></v-text>
        </template>
        <v-circle
          ref="points_0"
          :config="{
            x: 1300,
            y: 510,
            radius: 10,
            fill: `red`,
            stroke: `red`,
            strokeWidth: 1,
          }"
          v-if="index_num == 0"
        ></v-circle>
        <v-text
          :ref="`text_0`"
          :config="{
            x: 1290,
            y: 520,
            text: `0`,
            fontSize: 30,
            fontFamily: `Calibri`,
            fill: `black`,
          }"
          v-if="index_num == 0"
        ></v-text>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import { useField, useLogicUI, useRobot } from "../stores/store";
import lapanganNasionalNoRotate from "../assets/Lapangan_nasional_v2.png";
import lapanganNasionalWithRotate from "../assets/Lapangan_nasional_v2_rotate.png";
import lapanganRegionalNoRotate from "../assets/Lapangan_regional.png";

import Konva from "konva";

export default {
  data() {
    return {
      obs_robot_1: [],
      obs_robot_2: [],
      obs_robot_3: [],
      obs_robot_4: [],
      obs_robot_5: [],
      color: ["green", "blue", "pink", "red", "yellow"],
      all_points: [],
      all_texts: [],
      index_num: 9999,
    };
  },
  setup() {
    const FIELD_STATE = useField();
    const ROBOT_STATE = useRobot();
    const LOGIC_UI_STATE = useLogicUI();
    return {
      FIELD_STATE,
      LOGIC_UI_STATE,
      ROBOT_STATE,
    };
  },
  props: {
    field: {
      type: String,
      default: "nasional",
    },
  },
  created() {
    this.LOGIC_UI_STATE.current_field = this.field;

    // lapangan nasional
    if (this.field == "nasional") {
      this.FIELD_STATE.padding_tunning_x = 100;
      this.FIELD_STATE.padding_tunning_y = 110;

      this.FIELD_STATE.stage_config.width = 1400;
      this.FIELD_STATE.stage_config.height = 1020;
      this.FIELD_STATE.stage_config.x = 700;
      this.FIELD_STATE.stage_config.y = 510;
      this.FIELD_STATE.stage_config.offset.x = 700;
      this.FIELD_STATE.stage_config.offset.y = 510;

      this.FIELD_STATE.field_config.width = 1400;
      this.FIELD_STATE.field_config.height = 1020;
      this.FIELD_STATE.field_config.x = 0;
      this.FIELD_STATE.field_config.y = 0;
      this.FIELD_STATE.field_config.offset.x = 0;
      this.FIELD_STATE.field_config.offset.y = 0;

      this.FIELD_STATE.robot_config.forEach((robot) => {
        robot.width = 100;
        robot.height = 100;
        robot.x = 100;
        robot.y = 100;
        robot.offset.x = 50;
        robot.offset.y = 50;
      });

      this.FIELD_STATE.ball_config.forEach((ball) => {
        ball.width = 30;
        ball.height = 30;
        ball.x = 9999;
        ball.y = 9999;
        ball.offset.x = 15;
        ball.offset.y = 15;
      });

      this.FIELD_STATE.robot_offset.width = 100;
      this.FIELD_STATE.robot_offset.height = 100;
      this.FIELD_STATE.robot_offset.x = 100;
      this.FIELD_STATE.robot_offset.y = 100;
      this.FIELD_STATE.robot_offset.offset.x = 50;
      this.FIELD_STATE.robot_offset.offset.y = 50;

      this.FIELD_STATE.field_config.image.src = lapanganNasionalNoRotate;

      // lapangan regional
    } else if (this.field == "regional") {
      this.FIELD_STATE.padding_tunning_x = 58;
      this.FIELD_STATE.padding_tunning_y = 58;

      this.FIELD_STATE.stage_config.width = 1016;
      this.FIELD_STATE.stage_config.height = 716;
      this.FIELD_STATE.stage_config.x = 508;
      this.FIELD_STATE.stage_config.y = 358;
      this.FIELD_STATE.stage_config.offset.x = 508;
      this.FIELD_STATE.stage_config.offset.y = 358;

      this.FIELD_STATE.field_config.width = 1016;
      this.FIELD_STATE.field_config.height = 716;
      this.FIELD_STATE.field_config.x = 0;
      this.FIELD_STATE.field_config.y = 0;
      this.FIELD_STATE.field_config.offset.x = 0;
      this.FIELD_STATE.field_config.offset.y = 0;

      this.FIELD_STATE.robot_config.forEach((robot) => {
        robot.width = 70;
        robot.height = 70;
        robot.x = 100;
        robot.y = 100;
        robot.offset.x = 35;
        robot.offset.y = 35;
      });

      this.FIELD_STATE.ball_config.forEach((ball) => {
        ball.width = 20;
        ball.height = 20;
        ball.x = 9999;
        ball.y = 9999;
        ball.offset.x = 10;
        ball.offset.y = 10;
      });

      this.FIELD_STATE.robot_offset.width = 70;
      this.FIELD_STATE.robot_offset.height = 70;
      this.FIELD_STATE.robot_offset.x = 100;
      this.FIELD_STATE.robot_offset.y = 100;
      this.FIELD_STATE.robot_offset.offset.x = 35;
      this.FIELD_STATE.robot_offset.offset.y = 35;

      this.FIELD_STATE.field_config.image.src = lapanganRegionalNoRotate;
    }

    // N ROBOT INITIATION
    const ROBOT_CONFIG = this.FIELD_STATE.robot_config;
    const BALL_CONFIG = this.FIELD_STATE.ball_config;
    const IMAGE_ROBOT = this.FIELD_STATE.robot_image;
    const IMAGE_BALL = this.FIELD_STATE.ball_image;
    const LEN_ROBOT = this.FIELD_STATE.robot_config.length;

    // ROBOT OFFSET
    this.FIELD_STATE.robot_offset.image.src = IMAGE_ROBOT[5];

    for (let i = 0; i < LEN_ROBOT; i++) {
      ROBOT_CONFIG[i].image.src = IMAGE_ROBOT[i];
      BALL_CONFIG[i].image.src = IMAGE_BALL[i];
    }
  },
  mounted() {
    const THAT = this;
    const STAGE = THAT.$refs.stage.getStage();

    const anim = new Konva.Animation((frame) => {
      const STAGE_CONFIG = THAT.FIELD_STATE.stage_config;
      const SCENE_WIDTH = STAGE_CONFIG.width;
      const SCENE_HEIGHT = STAGE_CONFIG.height;
      const CONTAINER = document.querySelector("#container-stage");

      // RESPONSIVE FIELD
      if (CONTAINER != null) {
        const CONTAINER_WIDTH = CONTAINER.offsetWidth;
        const SCALE_STAGE = CONTAINER_WIDTH / SCENE_WIDTH;
        STAGE.width(SCENE_WIDTH * SCALE_STAGE);
        STAGE.height(SCENE_HEIGHT * SCALE_STAGE);
        STAGE.x(STAGE.width() / 2);
        STAGE.y(STAGE.height() / 2);
        STAGE.scale({ x: SCALE_STAGE, y: SCALE_STAGE });
      }

      // dynamic position robot
      const ROBOT = THAT.ROBOT_STATE.robot;
      const LEN_ROBOT = ROBOT.length;
      const ROBOT_CONFIG = THAT.FIELD_STATE.robot_config;
      const BALL_CONFIG = THAT.FIELD_STATE.ball_config;
      const IMAGE_ROBOT_WITH_BALL = THAT.FIELD_STATE.robot_with_ball_image;
      const IMAGE_ROBOT_WITHOUT_BALL = THAT.FIELD_STATE.robot_image;
      const LINE_CONFIG = THAT.FIELD_STATE.line_config;
      const ROTATE_FIELD = THAT.LOGIC_UI_STATE.rotate_field;

      for (let i = 0; i < LEN_ROBOT; i++) {
        // ROTATE FIELD
        if (ROTATE_FIELD) {
          ROBOT_CONFIG[i].x = THAT.ROBOT_STATE.posXWithRotate(
            ROBOT[i].pc2bs_data.pos_y
          );
          ROBOT_CONFIG[i].y = THAT.ROBOT_STATE.posYWithRotate(
            ROBOT[i].pc2bs_data.pos_x
          );
          ROBOT_CONFIG[i].rotation = THAT.ROBOT_STATE.thetaWithRotate(
            ROBOT[i].pc2bs_data.theta
          );
        } else {
          ROBOT_CONFIG[i].x = THAT.ROBOT_STATE.posXNoRotate(
            ROBOT[i].pc2bs_data.pos_y
          );
          ROBOT_CONFIG[i].y = THAT.ROBOT_STATE.posYNoRotate(
            ROBOT[i].pc2bs_data.pos_x
          );
          ROBOT_CONFIG[i].rotation = THAT.ROBOT_STATE.thetaNoRotate(
            ROBOT[i].pc2bs_data.theta
          );
        }

        // status_bola = 1 -> melihat bola
        // status_bola = 2 -> memegang bola
        // status_bola = 0 -> tidak mendeteksi bola
        if (ROBOT[i].pc2bs_data.status_bola == 0) {
          ROBOT_CONFIG[i].image.src = IMAGE_ROBOT_WITHOUT_BALL[i];
          LINE_CONFIG[i].x = 0;
          LINE_CONFIG[i].y = 0;
          LINE_CONFIG[i].points = [0, 0];

          BALL_CONFIG[i].x = 9999;
          BALL_CONFIG[i].y = 9999;
        } else if (ROBOT[i].pc2bs_data.status_bola == 1) {
          ROBOT_CONFIG[i].image.src = IMAGE_ROBOT_WITHOUT_BALL[i];
          LINE_CONFIG[i].x = ROBOT_CONFIG[i].x;
          LINE_CONFIG[i].y = ROBOT_CONFIG[i].y;
          LINE_CONFIG[i].points = [
            0,
            0,
            800 * Math.sin((ROBOT_CONFIG[i].rotation * -1 * Math.PI) / 180),
            800 * Math.cos((ROBOT_CONFIG[i].rotation * -1 * Math.PI) / 180),
          ];
          if (ROTATE_FIELD) {
            BALL_CONFIG[i].x = THAT.ROBOT_STATE.posXWithRotate(
              ROBOT[i].pc2bs_data.bola_y
            );
            BALL_CONFIG[i].y = THAT.ROBOT_STATE.posYWithRotate(
              ROBOT[i].pc2bs_data.bola_x
            );
          } else {
            BALL_CONFIG[i].x = THAT.ROBOT_STATE.posXNoRotate(
              ROBOT[i].pc2bs_data.bola_y
            );
            BALL_CONFIG[i].y = THAT.ROBOT_STATE.posYNoRotate(
              ROBOT[i].pc2bs_data.bola_x
            );
          }
        } else if (ROBOT[i].pc2bs_data.status_bola == 2) {
          ROBOT_CONFIG[i].image.src = IMAGE_ROBOT_WITH_BALL[i];
          LINE_CONFIG[i].x = ROBOT_CONFIG[i].x;
          LINE_CONFIG[i].y = ROBOT_CONFIG[i].y;
          LINE_CONFIG[i].points = [
            0,
            0,
            800 * Math.sin((ROBOT_CONFIG[i].rotation * -1 * Math.PI) / 180),
            800 * Math.cos((ROBOT_CONFIG[i].rotation * -1 * Math.PI) / 180),
          ];

          BALL_CONFIG[i].x = 9999;
          BALL_CONFIG[i].y = 9999;
        }
      }
    });
    anim.start();

    // render obs
    const obs_anim = new Konva.Animation(function (frame) {
      const ROBOT = THAT.ROBOT_STATE.robot;
      const LEN_ROBOT = ROBOT.length;
      const ROBOT_CONFIG = THAT.FIELD_STATE.robot_config;
      const ROTATE_FIELD = THAT.LOGIC_UI_STATE.rotate_field;

      THAT.obs_robot_1 = [];
      THAT.obs_robot_2 = [];
      THAT.obs_robot_3 = [];
      THAT.obs_robot_4 = [];
      THAT.obs_robot_5 = [];
      THAT.all_points = [];
      THAT.all_texts = [];
      // let num = [
      //   [1, 12, 23, 34, 45, 56, 67, 78],
      //   [2, 13, 24, 35, 46, 57, 68, 79],
      //   [3, 14, 25, 36, 47, 58, 69, 80],
      //   [4, 15, 26, 37, 48, 59, 70, 81],
      //   [5, 16, 27, 38, 49, 60, 71, 82],
      //   [6, 17, 28, 39, 50, 61, 72, 83],
      //   [7, 18, 29, 40, 51, 62, 73, 84],
      //   [8, 19, 30, 41, 52, 63, 74, 85],
      //   [9, 20, 31, 42, 53, 64, 75, 86],
      //   [10, 21, 32, 43, 54, 65, 76, 87],
      //   [11, 22, 33, 44, 55, 66, 77, 88],
      // ];
      let num = [
        [1, 11, 21, 31, 41, 51, 61, 71],
        [2, 12, 22, 32, 42, 52, 62, 72],
        [3, 13, 23, 33, 43, 53, 63, 73],
        [4, 14, 24, 34, 44, 54, 64, 74],
        [5, 15, 25, 35, 45, 55, 65, 75],
        [6, 16, 26, 36, 46, 56, 66, 76],
        [7, 17, 27, 37, 47, 57, 67, 77],
        [8, 18, 28, 38, 48, 58, 68, 78],
        [9, 19, 29, 39, 49, 59, 69, 79],
        [10, 20, 30, 40, 50, 60, 70, 80],
      ];
      // THAT.index_num = 9999;

      for (let i = 0; i < LEN_ROBOT; i++) {
        const OBS_DIST = THAT.ROBOT_STATE.robot[i].pc2bs_data.obs_dist;
        const OBS_SUDUT = THAT.ROBOT_STATE.robot[i].pc2bs_data.obs_sudut;

        for (let j = 0; j < OBS_DIST.length; j++) {
          let pos_x;
          let pos_y;
          pos_x =
            ROBOT_CONFIG[i].x +
            OBS_DIST[j] * Math.cos(((OBS_SUDUT[j] - 90) * Math.PI) / 180);
          pos_y =
            ROBOT_CONFIG[i].y -
            OBS_DIST[j] * Math.sin(((OBS_SUDUT[j] - 90) * Math.PI) / 180);
          let obs_config = {
            x: pos_x,
            y: pos_y,
            radius: 4,
            fill: THAT.color[i],
            stroke: "black",
            strokeWidth: 1,
          };
          if (i == 0) {
            THAT.obs_robot_1.push(obs_config);
          } else if (i == 1) {
            THAT.obs_robot_2.push(obs_config);
          } else if (i == 2) {
            THAT.obs_robot_3.push(obs_config);
          } else if (i == 3) {
            THAT.obs_robot_4.push(obs_config);
          } else if (i == 4) {
            THAT.obs_robot_5.push(obs_config);
          }
        }
      }

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 7; j++) {
          let x = 100 + j * 100;
          let y = 100 + i * 100;
          let pos_x = 200 + i * 100;
          let pos_y = 210 + j * 100;
          let obs_config = {
            x: pos_x,
            y: pos_y,
            radius: 10,
            fill: `blue`,
            stroke: `blue`,
            strokeWidth: 1,
          };
          let text_config = {
            x: 180 + i * 100,
            y: 220 + j * 100,
            text: `${num[i][j]}`,
            fontSize: 30,
            fontFamily: "Calibri",
            fill: "black",
          };
          THAT.all_points.push(obs_config);
          THAT.all_texts.push(text_config);
          // if (i < 5) {
          if (THAT.ROBOT_STATE.robot[1].pc2bs_data.index_point == num[i][j]) {
            // THAT.FIELD_STATE.line_point.x = THAT.ROBOT_STATE.posXNoRotate(
            //   THAT.ROBOT_STATE.robot[1].pc2bs_data.pos_x
            // );
            THAT.FIELD_STATE.line_point.x = 0;
            THAT.FIELD_STATE.line_point.y = 0;
            // THAT.FIELD_STATE.line_point.x = ROBOT_CONFIG[1].x;
            // THAT.FIELD_STATE.line_point.y = ROBOT_CONFIG[1].y;
            THAT.FIELD_STATE.line_point.points = [
              ROBOT_CONFIG[1].x,
              ROBOT_CONFIG[1].y,
              // 800 * Math.sin((ROBOT_CONFIG[i].rotation * -1 * Math.PI) / 180),
              // 800 * Math.cos((ROBOT_CONFIG[i].rotation * -1 * Math.PI) / 180),
              pos_x,
              pos_y,
            ];
            // }
            console.log(THAT.ROBOT_STATE.robot[1].pc2bs_data.index_point);
          }
        }

        // THAT.index_num = THAT.ROBOT_STATE.robot[i].pc2bs_data.index_point;
      }

      // for (let i = 0; i < LEN_ROBOT; i++) {
      //   // if (THAT.ROBOT_STATE.robot[i].pc2bs_data.robot_condition == 20) {
      //   THAT.index_num = THAT.ROBOT_STATE.robot[i].pc2bs_data.index_point;
      //   // }
      // }
    });
    obs_anim.start();
  },
  methods: {
    getPosition() {
      const THAT = this;
      if (
        THAT.LOGIC_UI_STATE.status_offset ||
        THAT.LOGIC_UI_STATE.status_manual
      ) {
        const position = THAT.$refs.stage.getNode().getPointerPosition();
        const x = position.x;
        const y = position.y;
        let stage = THAT.FIELD_STATE.stage_config;

        THAT.FIELD_STATE.mouse_pointer_x = Math.floor(
          (stage.height / THAT.$refs.stage.getNode().attrs.height) * y -
            THAT.FIELD_STATE.padding_tunning_y
        );
        THAT.FIELD_STATE.mouse_pointer_y = Math.floor(
          (stage.width / THAT.$refs.stage.getNode().attrs.width) * x -
            THAT.FIELD_STATE.padding_tunning_x
        );

        console.log(
          `x: ${THAT.FIELD_STATE.mouse_pointer_x}, y: ${THAT.FIELD_STATE.mouse_pointer_y}`
        );

        if (THAT.LOGIC_UI_STATE.status_manual) {
          THAT.FIELD_STATE.robot_offset.y = THAT.ROBOT_STATE.posXNoRotate(
            THAT.FIELD_STATE.mouse_pointer_x
          );
          THAT.FIELD_STATE.robot_offset.x = THAT.ROBOT_STATE.posYNoRotate(
            THAT.FIELD_STATE.mouse_pointer_y
          );
          THAT.ROBOT_STATE.ui_to_server.target_manual_x = parseInt(
            THAT.FIELD_STATE.mouse_pointer_x.toString() +
              THAT.LOGIC_UI_STATE.n_robot_manual.toString()
          );
          THAT.ROBOT_STATE.ui_to_server.target_manual_y = parseInt(
            THAT.FIELD_STATE.mouse_pointer_y.toString() +
              THAT.LOGIC_UI_STATE.n_robot_manual.toString()
          );
          THAT.ROBOT_STATE.ui_to_server.target_manual_theta = parseInt(
            THAT.ROBOT_STATE.thetaNoRotate(
              THAT.ROBOT_STATE.returnTheta(
                THAT.FIELD_STATE.robot_offset.rotation
              )
            ).toString() + THAT.LOGIC_UI_STATE.n_robot_manual.toString()
          );
        } else if (THAT.LOGIC_UI_STATE.status_offset) {
          THAT.FIELD_STATE.robot_offset.y = THAT.ROBOT_STATE.posYNoRotate(
            THAT.FIELD_STATE.mouse_pointer_x
          );
          THAT.FIELD_STATE.robot_offset.x = THAT.ROBOT_STATE.posXNoRotate(
            THAT.FIELD_STATE.mouse_pointer_y
          );
          // THAT.FIELD_STATE.robot_offset.rotation = THAT.ROBOT_STATE.returnTheta(
          //   THAT.FIELD_STATE.robot_offset.rotation
          // );
        }
      }
    },
  },
  watch: {
    "FIELD_STATE.robot_offset.rotation": {
      handler() {
        const THAT = this;
        if (THAT.LOGIC_UI_STATE.status_manual) {
          THAT.ROBOT_STATE.ui_to_server.target_manual_theta = parseInt(
            THAT.ROBOT_STATE.thetaOffset().toString() +
              THAT.LOGIC_UI_STATE.n_robot_manual.toString()
          );
        }
      },
      deep: true,
    },
    "LOGIC_UI_STATE.rotate_field": {
      handler() {
        const THAT = this;
        const ROTATE_FIELD = THAT.LOGIC_UI_STATE.rotate_field;
        if (this.field == "regional") {
          this.FIELD_STATE.field_config.image.src = lapanganRegionalNoRotate;
        } else if (this.field == "nasional") {
          if (ROTATE_FIELD) {
            THAT.FIELD_STATE.field_config.image.src =
              lapanganNasionalWithRotate;
          } else {
            THAT.FIELD_STATE.field_config.image.src = lapanganNasionalNoRotate;
          }
        }
      },
      deep: true,
    },
    "LOGIC_UI_STATE.n_robot_manual": {
      handler() {
        const THAT = this;
        let n_robot = THAT.LOGIC_UI_STATE.n_robot_manual - 1;
        if (
          THAT.LOGIC_UI_STATE.status_manual &&
          THAT.ROBOT_STATE.robot[n_robot].self_data.is_active &&
          THAT.ROBOT_STATE.ui_to_server.status_control_robot[n_robot]
        ) {
          THAT.ROBOT_STATE.ui_to_server.target_manual_x = parseInt(
            THAT.ROBOT_STATE.robot[n_robot].pc2bs_data.pos_x.toString() +
              THAT.LOGIC_UI_STATE.n_robot_manual.toString()
          );
          THAT.ROBOT_STATE.ui_to_server.target_manual_y = parseInt(
            THAT.ROBOT_STATE.robot[n_robot].pc2bs_data.pos_y.toString() +
              THAT.LOGIC_UI_STATE.n_robot_manual.toString()
          );
          THAT.ROBOT_STATE.ui_to_server.target_manual_theta = parseInt(
            THAT.ROBOT_STATE.robot[n_robot].pc2bs_data.theta.toString() +
              THAT.LOGIC_UI_STATE.n_robot_manual.toString()
          );
        }
      },
      deep: true,
    },
  },
};
</script>
