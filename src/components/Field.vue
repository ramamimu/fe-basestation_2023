<template>
  <div ref="container">
    <v-stage
      ref="stage"
      :config="FIELD_STATE.stage_config"
      @click="getPosition()"
    >
      <v-layer ref="layer">
        <v-image ref="field" :config="FIELD_STATE.field_config" />

        <template v-for="(item, index) in ROBOT_STATE.robot" :key="index">
          <Robot
            :index_robot="index"
            :identifier="'robot_icp_config'"
            v-if="isShow(index)"
          />
        </template>

        <!-- OBSTACLE -->
        <!-- <template v-for="(item, index) in ROBOT_STATE.robot" :key="index">
          <Obstacle
            :index_robot="index"
            :obs_robot_1="obs_robot_1"
            :obs_robot_2="obs_robot_2"
            :obs_robot_3="obs_robot_3"
            :obs_robot_4="obs_robot_4"
            :obs_robot_5="obs_robot_5"
            v-if="isShow(index)"
          />
        </template> -->

        <!-- GROUP OBSTACLE -->
        <!-- <template v-for="(item, index) in ROBOT_STATE.robot" :key="index">
          <Obstacle
            :index_robot="index"
            :obs_robot_1="group_obs_robot_1"
            :obs_robot_2="group_obs_robot_2"
            :obs_robot_3="group_obs_robot_3"
            :obs_robot_4="group_obs_robot_4"
            :obs_robot_5="group_obs_robot_5"
            v-if="isShow(index)"
          />
        </template> -->

        <!-- GROUP POS OBSTACLE -->
        <template v-for="(item, index) in ROBOT_STATE.robot" :key="index">
          <Obstacle
            :length="ROBOT_STATE.robot[index].pc2bs_data.pos_obs_length"
            :index_robot="index"
            :obs_robot_1="group_pos_obs_robot_1"
            :obs_robot_2="group_pos_obs_robot_2"
            :obs_robot_3="group_pos_obs_robot_3"
            :obs_robot_4="group_pos_obs_robot_4"
            :obs_robot_5="group_pos_obs_robot_5"
            v-if="isShow(index)"
          />
        </template>

        <!-- <template v-for="(obs, index) in all_texts" :key="index">
          <v-circle
            :ref="`points_${index + 1}`"
            :config="all_points[index]"
            v-if="index_num == obs.text"
          ></v-circle>
          <v-text
            :ref="`text_${index + 1}`"
            :config="all_texts[index]"
            v-if="index_num == obs.text"
          ></v-text>
        </template>
        <v-circle
          ref="points_0"
          :config="{
            x: LOGIC_UI_STATE.rotate_field ? 100 : 1300,
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
            x: LOGIC_UI_STATE.rotate_field ? 90 : 1290,
            y: 530,
            text: `0`,
            fontSize: 30,
            fontFamily: `Calibri`,
            fill: `black`,
          }"
          v-if="index_num == 0"
        ></v-text> -->

        <!-- OBS REGIONAL -->
        <template v-if="$route.path == '/regional' && LOGIC_UI_STATE.is_obs">
          <template v-for="(obs, index) in FIELD_STATE.obs_config" :key="index">
            <v-rect
              :config="FIELD_STATE.obs_config[index]"
              :ref="`obs_${index}`"
            ></v-rect>
          </template>
        </template>

        <!-- ROBOT OFFSET -->
        <template
          v-if="LOGIC_UI_STATE.status_offset || LOGIC_UI_STATE.status_manual"
        >
          <v-line :config="FIELD_STATE.line_offset"></v-line>
          <v-image
            :ref="`robot_offset`"
            :config="FIELD_STATE.robot_offset"
          ></v-image>
        </template>

        <!-- <v-line :config="FIELD_STATE.line_point" ref="pass_line_1"></v-line> -->
        <template v-for="(item, index) in ROBOT_STATE.robot" :key="index">
          <v-line
            :config="line_point[index]"
            :ref="`pass_line_${index}`"
          ></v-line>
        </template>

        <!-- ROBOT GOAL KEEPER -->
        <!-- <template>
          <v-image
            :ref="`robot_goal_keeper`"
            :config="FIELD_STATE.robot_goalkeeper"
          ></v-image>
        </template> -->
        <template v-for="(item, index) in ROBOT_STATE.robot" :key="index">
          <v-circle
            v-if="ROBOT_STATE.robot[index].self_data.is_active"
            :ref="`target_goal_keeper${index + 1}`"
            :config="FIELD_STATE.target_goalkeeper[index]"
          ></v-circle>
        </template>

        <!-- SHOOTLINE -->
        <template v-for="(item, index) in ROBOT_STATE.robot" :key="index">
          <Shootline :index_robot="index" v-if="isShow(index)" />
        </template>

        <!-- ROBOT & BOLA -->
        <template v-for="(item, index) in ROBOT_STATE.robot" :key="index">
          <Robot
            :index_robot="index"
            :identifier="'robot_config'"
            v-if="isShow(index)"
          />
          <Ball
            :identifier="'ball_config'"
            :index_robot="index"
            v-if="isShow(index)"
          />
          <!-- ball next -->
          <v-image :config="FIELD_STATE.ball_next_config[index]"></v-image>
        </template>

        <!-- BALL GLOBAL -->
        <!-- <Ball :identifier="'ball_global_config'" /> -->
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import { useField, useLogicUI, useRobot } from "../stores/store";
import lapanganNasionalNoRotate from "../assets/Lapangan_nasional_v2.png";
import lapanganNasionalWithRotate from "../assets/Lapangan_nasional_v2_rotate.png";
import lapanganRegionalNoRotate from "../assets/Lapangan_regional.png";
import lapanganTianjinWithRotate from "../assets/lapangan_tianjin_rotate.png";
import lapanganTianjinNoRotate from "../assets/lapangan_tianjin_no_rotate.png";
import lapanganRegionalNoRotateNew from "../assets/Lapangan_regional_no_rotate.png";
import lapanganRegionalWithRotateNew from "../assets/Lapangan_regional_with_rotate.png";

import Ball from "./field/Ball.vue";
import Robot from "./field/Robot.vue";
import Shootline from "./field/Shootline.vue";
import Obstacle from "./field/Obstacle.vue";

import Konva from "konva";
import router from "../router";

export default {
  components: { Ball, Shootline, Obstacle, Robot },
  data() {
    return {
      obs_robot_1: [],
      obs_robot_2: [],
      obs_robot_3: [],
      obs_robot_4: [],
      obs_robot_5: [],
      group_obs_robot_1: [],
      group_obs_robot_2: [],
      group_obs_robot_3: [],
      group_obs_robot_4: [],
      group_obs_robot_5: [],
      group_pos_obs_robot_1: [],
      group_pos_obs_robot_2: [],
      group_pos_obs_robot_3: [],
      group_pos_obs_robot_4: [],
      group_pos_obs_robot_5: [],
      color: ["green", "blue", "pink", "red", "yellow"],
      all_points: [],
      all_texts: [],
      x_and_y: [],
      index_num: 9999,
      line_point: [],
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
    if (this.field == "nasional" || this.field == "tianjin") {
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

      this.FIELD_STATE.robot_icp_config.forEach((robot) => {
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

      this.FIELD_STATE.ball_next_config.forEach((ball) => {
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

      this.FIELD_STATE.robot_goalkeeper.width = 90;
      this.FIELD_STATE.robot_goalkeeper.height = 90;
      this.FIELD_STATE.robot_goalkeeper.x = 100;
      this.FIELD_STATE.robot_goalkeeper.y = 100;
      this.FIELD_STATE.robot_goalkeeper.rotation = 270;
      this.FIELD_STATE.robot_goalkeeper.offset.x = 35;
      this.FIELD_STATE.robot_goalkeeper.offset.y = 35;

      if (this.field == "nasional") {
        this.FIELD_STATE.field_config.image.src = this.LOGIC_UI_STATE
          .rotate_field
          ? lapanganNasionalWithRotate
          : lapanganNasionalNoRotate;
      } else if (this.field == "tianjin") {
        this.FIELD_STATE.field_config.image.src = this.LOGIC_UI_STATE
          .rotate_field
          ? lapanganTianjinWithRotate
          : lapanganTianjinNoRotate;
      }

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

      this.FIELD_STATE.robot_icp_config.forEach((robot) => {
        robot.width = 100;
        robot.height = 100;
        robot.x = 100;
        robot.y = 100;
        robot.offset.x = 50;
        robot.offset.y = 50;
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

      this.FIELD_STATE.robot_goalkeeper.width = 90;
      this.FIELD_STATE.robot_goalkeeper.height = 90;
      this.FIELD_STATE.robot_goalkeeper.x = 100;
      this.FIELD_STATE.robot_goalkeeper.y = 100;
      this.FIELD_STATE.robot_goalkeeper.rotation = 270;
      this.FIELD_STATE.robot_goalkeeper.offset.x = 35;
      this.FIELD_STATE.robot_goalkeeper.offset.y = 35;

      this.FIELD_STATE.field_config.image.src = lapanganRegionalNoRotateNew;
    }

    // N ROBOT INITIATION
    const ROBOT_CONFIG = this.FIELD_STATE.robot_config;
    const ROBOT_ICP_CONFIG = this.FIELD_STATE.robot_icp_config;
    const BALL_CONFIG = this.FIELD_STATE.ball_config;
    const BALL_NEXT_CONFIG = this.FIELD_STATE.ball_next_config;
    const IMAGE_ROBOT = this.FIELD_STATE.robot_image;
    const IMAGE_BALL = this.FIELD_STATE.ball_image;
    const IMAGE_BALL_NEXT = this.FIELD_STATE.ball_image_next;
    const LEN_ROBOT = this.FIELD_STATE.robot_config.length;
    const IMAGE_BALL_GLOBAL = this.FIELD_STATE.ball_global_img;
    const IMAGE_ROBOT_OFFSET = this.FIELD_STATE.r_offset;
    const IMAGE_ROBOT_GOALKEEPER = this.FIELD_STATE.r_goalkeeper;

    // ROBOT OFFSET
    this.FIELD_STATE.robot_offset.image.src = IMAGE_ROBOT_OFFSET;

    // ROBOT GOAL KEEPER
    this.FIELD_STATE.robot_goalkeeper.image.src = IMAGE_ROBOT_GOALKEEPER;

    // BALL GLOBAL
    this.FIELD_STATE.ball_global_config.image.src = IMAGE_BALL_GLOBAL;

    for (let i = 0; i < LEN_ROBOT; i++) {
      ROBOT_CONFIG[i].image.src = IMAGE_ROBOT[i];
      ROBOT_ICP_CONFIG[i].image.src = IMAGE_ROBOT[i];
      BALL_CONFIG[i].image.src = IMAGE_BALL[i];
      BALL_NEXT_CONFIG[i].image.src = IMAGE_BALL[i];
    }
  },
  mounted() {
    const THAT = this;
    const STAGE = THAT.$refs.stage.getStage();

    let GLOBAL_DATA_SERVER = THAT.ROBOT_STATE.global_data_server;
    const ROBOT = THAT.ROBOT_STATE.robot;
    const LEN_ROBOT = ROBOT.length;

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
      const ROBOT_CONFIG = THAT.FIELD_STATE.robot_config;
      const ROBOT_ICP_CONFIG = THAT.FIELD_STATE.robot_icp_config;
      const BALL_CONFIG = THAT.FIELD_STATE.ball_config;
      const BALL_NEXT_CONFIG = THAT.FIELD_STATE.ball_next_config;
      const IMAGE_ROBOT_WITH_BALL = THAT.FIELD_STATE.robot_with_ball_image;
      const IMAGE_ROBOT_WITHOUT_BALL = THAT.FIELD_STATE.robot_image;
      const LINE_CONFIG = THAT.FIELD_STATE.line_config;
      const ROTATE_FIELD = THAT.LOGIC_UI_STATE.rotate_field;
      const BALL_GLOBAL_CONFIG = THAT.FIELD_STATE.ball_global_config;
      const GOAL_KEEPER = THAT.FIELD_STATE.robot_goalkeeper;
      const TARGET_KEEPER = THAT.FIELD_STATE.target_goalkeeper;

      THAT.FIELD_STATE.line_offset.x = THAT.FIELD_STATE.robot_offset.x;
      THAT.FIELD_STATE.line_offset.y = THAT.FIELD_STATE.robot_offset.y;
      THAT.FIELD_STATE.line_offset.points = [
        0,
        0,
        800 *
          Math.sin(
            (THAT.FIELD_STATE.robot_offset.rotation * -1 * Math.PI) / 180
          ),
        800 *
          Math.cos(
            (THAT.FIELD_STATE.robot_offset.rotation * -1 * Math.PI) / 180
          ),
      ];

      // General Field
      for (let i = 0; i < LEN_ROBOT; i++) {
        // ROTATE FIELD
        if (ROTATE_FIELD) {
          ROBOT_CONFIG[i].x = THAT.ROBOT_STATE.posXWithRotate(
            THAT.ROBOT_STATE.robot[i].pc2bs_data.pos_y
          );
          ROBOT_CONFIG[i].y = THAT.ROBOT_STATE.posYWithRotate(
            THAT.ROBOT_STATE.robot[i].pc2bs_data.pos_x
          );
          ROBOT_CONFIG[i].rotation = THAT.ROBOT_STATE.thetaWithRotate(
            THAT.ROBOT_STATE.robot[i].pc2bs_data.theta
          );

          ROBOT_ICP_CONFIG[i].x = THAT.ROBOT_STATE.posXWithRotate(
            THAT.ROBOT_STATE.robot[i].pc2bs_data.pos_y_next
          );
          ROBOT_ICP_CONFIG[i].y = THAT.ROBOT_STATE.posYWithRotate(
            THAT.ROBOT_STATE.robot[i].pc2bs_data.pos_x_next
          );
          // ROBOT_ICP_CONFIG[i].rotation = THAT.ROBOT_STATE.thetaWithRotate(
          //   THAT.ROBOT_STATE.robot[i].pc2bs_data.theta_odometry
          // );

          TARGET_KEEPER.x = THAT.ROBOT_STATE.posXWithRotate(
            THAT.ROBOT_STATE.robot[i].pc2bs_data.goalkeeper_field_x
          );
          TARGET_KEEPER.y = THAT.ROBOT_STATE.posYWithRotate(
            THAT.ROBOT_STATE.robot[i].pc2bs_data.goalkeeper_field_y
          );
        } else {
          ROBOT_CONFIG[i].x = THAT.ROBOT_STATE.posXNoRotate(
            THAT.ROBOT_STATE.robot[i].pc2bs_data.pos_y
          );
          ROBOT_CONFIG[i].y = THAT.ROBOT_STATE.posYNoRotate(
            THAT.ROBOT_STATE.robot[i].pc2bs_data.pos_x
          );
          ROBOT_CONFIG[i].rotation = THAT.ROBOT_STATE.thetaNoRotate(
            THAT.ROBOT_STATE.robot[i].pc2bs_data.theta
          );

          ROBOT_ICP_CONFIG[i].x = THAT.ROBOT_STATE.posXNoRotate(
            THAT.ROBOT_STATE.robot[i].pc2bs_data.pos_y_next
          );
          ROBOT_ICP_CONFIG[i].y = THAT.ROBOT_STATE.posYNoRotate(
            THAT.ROBOT_STATE.robot[i].pc2bs_data.pos_x_next
          );
          // ROBOT_ICP_CONFIG[i].rotation = THAT.ROBOT_STATE.thetaNoRotate(
          //   THAT.ROBOT_STATE.robot[i].pc2bs_data.theta_odometry
          // );

          TARGET_KEEPER.x = THAT.ROBOT_STATE.posXNoRotate(
            THAT.ROBOT_STATE.robot[i].pc2bs_data.goalkeeper_field_x
          );
          TARGET_KEEPER.y = THAT.ROBOT_STATE.posYNoRotate(
            THAT.ROBOT_STATE.robot[i].pc2bs_data.goalkeeper_field_y
          );
        }

        // status_bola = 1 -> melihat bola
        // status_bola = 2 -> memegang bola
        // status_bola = 0 -> tidak mendeteksi bola
        if (THAT.ROBOT_STATE.robot[i].pc2bs_data.status_bola == 0) {
          ROBOT_CONFIG[i].image.src = IMAGE_ROBOT_WITHOUT_BALL[i];
          LINE_CONFIG[i].x = 0;
          LINE_CONFIG[i].y = 0;
          LINE_CONFIG[i].points = [0, 0];

          BALL_CONFIG[i].x = 9999;
          BALL_CONFIG[i].y = 9999;

          BALL_NEXT_CONFIG[i].x = 9999;
          BALL_NEXT_CONFIG[i].y = 9999;
        } else if (THAT.ROBOT_STATE.robot[i].pc2bs_data.status_bola == 1) {
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
              THAT.ROBOT_STATE.robot[i].pc2bs_data.bola_y
            );
            BALL_CONFIG[i].y = THAT.ROBOT_STATE.posYWithRotate(
              THAT.ROBOT_STATE.robot[i].pc2bs_data.bola_x
            );

            BALL_NEXT_CONFIG[i].x = THAT.ROBOT_STATE.posXWithRotate(
              THAT.ROBOT_STATE.robot[i].pc2bs_data.bola_y_next
            );
            BALL_NEXT_CONFIG[i].y = THAT.ROBOT_STATE.posYWithRotate(
              THAT.ROBOT_STATE.robot[i].pc2bs_data.bola_x_next
            );
          } else {
            BALL_CONFIG[i].x = THAT.ROBOT_STATE.posXNoRotate(
              THAT.ROBOT_STATE.robot[i].pc2bs_data.bola_y
            );
            BALL_CONFIG[i].y = THAT.ROBOT_STATE.posYNoRotate(
              THAT.ROBOT_STATE.robot[i].pc2bs_data.bola_x
            );

            BALL_NEXT_CONFIG[i].x = THAT.ROBOT_STATE.posXNoRotate(
              THAT.ROBOT_STATE.robot[i].pc2bs_data.bola_y_next
            );
            BALL_NEXT_CONFIG[i].y = THAT.ROBOT_STATE.posYNoRotate(
              THAT.ROBOT_STATE.robot[i].pc2bs_data.bola_x_next
            );
          }
        } else if (THAT.ROBOT_STATE.robot[i].pc2bs_data.status_bola == 2) {
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

          BALL_NEXT_CONFIG[i].x = 9999;
          BALL_NEXT_CONFIG[i].y = 9999;
        }
      }

      if (ROTATE_FIELD) {
        GOAL_KEEPER.x = THAT.ROBOT_STATE.posXWithRotate(
          GLOBAL_DATA_SERVER.goalkeeper_field_y
        );
        GOAL_KEEPER.y = THAT.ROBOT_STATE.posYWithRotate(
          GLOBAL_DATA_SERVER.goalkeeper_field_x
        );
        GOAL_KEEPER.rotation = 270;
      } else {
        GOAL_KEEPER.x = THAT.ROBOT_STATE.posXNoRotate(
          GLOBAL_DATA_SERVER.goalkeeper_field_y
        );
        GOAL_KEEPER.y = THAT.ROBOT_STATE.posYNoRotate(
          GLOBAL_DATA_SERVER.goalkeeper_field_x
        );
        GOAL_KEEPER.rotation = 90;
      }

      if (THAT.ROBOT_STATE.global_data_server.n_robot_aktif > 0) {
        let ball_detected =
          THAT.ROBOT_STATE.global_data_server.n_robot_dekat_bola;
        let ball_catched =
          THAT.ROBOT_STATE.global_data_server.n_robot_dapat_bola;

        if (ball_detected != 0 || ball_catched != 0) {
          BALL_GLOBAL_CONFIG.x = THAT.ROBOT_STATE.getXBallGlobal();
          BALL_GLOBAL_CONFIG.y = THAT.ROBOT_STATE.getYBallGlobal();
        } else {
          BALL_GLOBAL_CONFIG.x = 9999;
          BALL_GLOBAL_CONFIG.y = 9999;
        }
      } else {
        BALL_GLOBAL_CONFIG.x = 9999;
        BALL_GLOBAL_CONFIG.y = 9999;
      }
    });
    anim.start();

    // render obs
    const obs_anim = new Konva.Animation(function (frame) {
      const ROBOT = THAT.ROBOT_STATE.robot;
      const LEN_ROBOT = ROBOT.length;
      const ROBOT_CONFIG = THAT.FIELD_STATE.robot_config;
      const IS_ROTATE = THAT.LOGIC_UI_STATE.rotate_field;

      THAT.FIELD_STATE.line_point.y = 0;
      THAT.FIELD_STATE.line_point.points = [0, 0];
      THAT.FIELD_STATE.line_point.x = 0;
      THAT.index_num = 9999;

      THAT.obs_robot_1 = [];
      THAT.obs_robot_2 = [];
      THAT.obs_robot_3 = [];
      THAT.obs_robot_4 = [];
      THAT.obs_robot_5 = [];
      THAT.group_obs_robot_1 = [];
      THAT.group_obs_robot_2 = [];
      THAT.group_obs_robot_3 = [];
      THAT.group_obs_robot_4 = [];
      THAT.group_obs_robot_5 = [];
      THAT.group_pos_obs_robot_1 = [];
      THAT.group_pos_obs_robot_2 = [];
      THAT.group_pos_obs_robot_3 = [];
      THAT.group_pos_obs_robot_4 = [];
      THAT.group_pos_obs_robot_5 = [];
      THAT.all_points = [];
      THAT.all_texts = [];
      THAT.x_and_y = [];
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
      THAT.line_point = [];

      // OBS ROBOT
      for (let i = 0; i < LEN_ROBOT; i++) {
        const ROBOT = THAT.ROBOT_STATE.robot[i];
        const LEN_OBS = THAT.ROBOT_STATE.robot[i].pc2bs_data.obs_length;
        const LEN_GROUP_OBS =
          THAT.ROBOT_STATE.robot[i].self_data.group_obs_x.length;
        const LEN_GROUP_POS_OBS =
          THAT.ROBOT_STATE.robot[i].pc2bs_data.pos_obs_length;

        let obstacle = [];
        let group_obstacle = [];
        let group_pos_obstacle = [];

        // OBS ROBOT
        for (let j = 0; j < LEN_OBS; j++) {
          let pos_x = IS_ROTATE
            ? THAT.ROBOT_STATE.posXWithRotate(ROBOT.self_data.obs_y[j])
            : THAT.ROBOT_STATE.posXNoRotate(ROBOT.self_data.obs_y[j]);
          let pos_y = IS_ROTATE
            ? THAT.ROBOT_STATE.posYWithRotate(ROBOT.self_data.obs_x[j])
            : THAT.ROBOT_STATE.posYNoRotate(ROBOT.self_data.obs_x[j]);

          let obs_config = {
            x: pos_x,
            y: pos_y,
            radius: 4,
            fill: THAT.color[i],
            stroke: "black",
            strokeWidth: 1,
          };

          obstacle.push(obs_config);
        }

        // GROUP OBS ROBOT
        for (let k = 0; k < LEN_GROUP_OBS; k++) {
          let group_pos_x = IS_ROTATE
            ? THAT.ROBOT_STATE.posXWithRotate(ROBOT.self_data.group_obs_y[k])
            : THAT.ROBOT_STATE.posXNoRotate(ROBOT.self_data.group_obs_y[k]);
          let group_pos_y = IS_ROTATE
            ? THAT.ROBOT_STATE.posYWithRotate(ROBOT.self_data.group_obs_x[k])
            : THAT.ROBOT_STATE.posYNoRotate(ROBOT.self_data.group_obs_x[k]);

          let group_obs_config = {
            x: group_pos_x,
            y: group_pos_y,
            radius: 20,
            fill: THAT.color[i],
            opacity: 0.3,
            stroke: "black",
            strokeWidth: 2,
          };

          group_obstacle.push(group_obs_config);
        }

        // GROUP POS OBS ROBOT
        for (let l = 0; l < LEN_GROUP_POS_OBS; l++) {
          let group_pos_x = IS_ROTATE
            ? THAT.ROBOT_STATE.posXWithRotate(ROBOT.pc2bs_data.pos_obs_y[l])
            : THAT.ROBOT_STATE.posXNoRotate(ROBOT.pc2bs_data.pos_obs_y[l]);
          let group_pos_y = IS_ROTATE
            ? THAT.ROBOT_STATE.posYWithRotate(ROBOT.pc2bs_data.pos_obs_x[l])
            : THAT.ROBOT_STATE.posYNoRotate(ROBOT.pc2bs_data.pos_obs_x[l]);

          let group_pos_obs_config = {
            x: group_pos_x,
            y: group_pos_y,
            radius: 20,
            fill: THAT.color[i],
            opacity: 0.7,
            stroke: "black",
            strokeWidth: 2,
          };

          group_pos_obstacle.push(group_pos_obs_config);
        }

        switch (i) {
          case 0:
            THAT.obs_robot_1 = [...obstacle];
            THAT.group_obs_robot_1 = [...group_obstacle];
            THAT.group_pos_obs_robot_1 = [...group_pos_obstacle];
            break;
          case 1:
            THAT.obs_robot_2 = [...obstacle];
            THAT.group_obs_robot_2 = [...group_obstacle];
            THAT.group_pos_obs_robot_2 = [...group_pos_obstacle];
            break;
          case 2:
            THAT.obs_robot_3 = [...obstacle];
            THAT.group_obs_robot_3 = [...group_obstacle];
            THAT.group_pos_obs_robot_3 = [...group_pos_obstacle];
            break;
          case 3:
            THAT.obs_robot_4 = [...obstacle];
            THAT.group_obs_robot_4 = [...group_obstacle];
            THAT.group_pos_obs_robot_4 = [...group_pos_obstacle];
            break;
          case 4:
            THAT.obs_robot_5 = [...obstacle];
            THAT.group_obs_robot_5 = [...group_obstacle];
            THAT.group_pos_obs_robot_5 = [...group_pos_obstacle];
            break;
        }
      }

      // PASS TARGET
      for (let k = 0; k < LEN_ROBOT; k++) {
        let line_config = {
          x: 0,
          y: 0,
          points: [0, 0],
          tension: 0.8,
          strokeWidth: 12,
          closed: false,
          stroke: "red",
        };

        THAT.line_point.push(line_config);

        if (
          THAT.ROBOT_STATE.ui_to_server.status_control_robot[k] &&
          THAT.ROBOT_STATE.robot[k].self_data.is_active
        ) {
          let pos_x = IS_ROTATE
            ? THAT.ROBOT_STATE.posXWithRotate(
                THAT.ROBOT_STATE.robot[k].pc2bs_data.pass_target_y
              )
            : THAT.ROBOT_STATE.posXNoRotate(
                THAT.ROBOT_STATE.robot[k].pc2bs_data.pass_target_y
              );
          let pos_y = IS_ROTATE
            ? THAT.ROBOT_STATE.posYWithRotate(
                THAT.ROBOT_STATE.robot[k].pc2bs_data.pass_target_x
              )
            : THAT.ROBOT_STATE.posYNoRotate(
                THAT.ROBOT_STATE.robot[k].pc2bs_data.pass_target_x
              );
          //////////////////////////////////////////////////////
          // THAT.FIELD_STATE.line_point.x = 0;
          // THAT.FIELD_STATE.line_point.y = 0;
          // THAT.FIELD_STATE.line_point.points = [
          //   ROBOT_CONFIG[k].x,
          //   ROBOT_CONFIG[k].y,
          //   pos_x,
          //   pos_y,
          // ];
          //////////////////////////////////////////////////////
          if (
            THAT.ROBOT_STATE.robot[k].pc2bs_data.pass_target_y != 0 ||
            THAT.ROBOT_STATE.robot[k].pc2bs_data.pass_target_x != 0
          ) {
            THAT.line_point[k].stroke = THAT.color[k];
            THAT.line_point[k].x = 0;
            THAT.line_point[k].y = 0;
            THAT.line_point[k].points = [
              ROBOT_CONFIG[k].x,
              ROBOT_CONFIG[k].y,
              pos_x,
              pos_y,
            ];
          }
        }
      }

      // OBSTACLE REGIONAL
      if (THAT.$route.path == "/regional") {
        const OBS_LEN = THAT.FIELD_STATE.obs_config.length;
        let obs_kiper = THAT.ROBOT_STATE.obs_num.obs_kiper;
        let obs_robot = THAT.ROBOT_STATE.obs_num.obs_robot;

        for (let i = 0; i < OBS_LEN; i++) {
          if (i == 0) {
            THAT.FIELD_STATE.obs_config[i].x = IS_ROTATE
              ? THAT.ROBOT_STATE.posXWithRotate(
                  THAT.ROBOT_STATE.obs_point_keeper[obs_kiper - 1].y
                )
              : THAT.ROBOT_STATE.posXNoRotate(
                  THAT.ROBOT_STATE.obs_point_keeper[obs_kiper - 1].y
                );
            THAT.FIELD_STATE.obs_config[i].y = IS_ROTATE
              ? THAT.ROBOT_STATE.posYWithRotate(
                  THAT.ROBOT_STATE.obs_point_keeper[obs_kiper - 1].x
                )
              : THAT.ROBOT_STATE.posYNoRotate(
                  THAT.ROBOT_STATE.obs_point_keeper[obs_kiper - 1].x
                );
          } else {
            THAT.FIELD_STATE.obs_config[i].x = IS_ROTATE
              ? THAT.ROBOT_STATE.posXWithRotate(
                  THAT.ROBOT_STATE.obs_point[obs_robot[i - 1] - 1].y
                )
              : THAT.ROBOT_STATE.posXNoRotate(
                  THAT.ROBOT_STATE.obs_point[obs_robot[i - 1] - 1].y
                );
            THAT.FIELD_STATE.obs_config[i].y = IS_ROTATE
              ? THAT.ROBOT_STATE.posYWithRotate(
                  THAT.ROBOT_STATE.obs_point[obs_robot[i - 1] - 1].x
                )
              : THAT.ROBOT_STATE.posYNoRotate(
                  THAT.ROBOT_STATE.obs_point[obs_robot[i - 1] - 1].x
                );
          }
        }

        // Sending obs to robot
        for (let i = 0, j = 0; i < 4; i++) {
          if (i % 2 == 0) {
            THAT.ROBOT_STATE.ui_to_server.pos_obs[i] =
              THAT.ROBOT_STATE.obs_point[obs_robot[j] - 1].x;
          } else {
            THAT.ROBOT_STATE.ui_to_server.pos_obs[i] =
              THAT.ROBOT_STATE.obs_point[obs_robot[j] - 1].y;
            j++;
          }
        }
        THAT.ROBOT_STATE.ui_to_server.pos_obs[4] =
          THAT.ROBOT_STATE.obs_point_keeper[obs_kiper - 1].x;
        THAT.ROBOT_STATE.ui_to_server.pos_obs[5] =
          THAT.ROBOT_STATE.obs_point_keeper[obs_kiper - 1].y;
      }
    });
    obs_anim.start();
  },
  methods: {
    isShow(index) {
      const THAT = this;
      let res = false;
      if (
        (THAT.ROBOT_STATE.ui_to_server.status_control_robot[index] &&
          THAT.ROBOT_STATE.robot[index].self_data.is_active) ||
        (THAT.LOGIC_UI_STATE.is_show_before_linked &&
          THAT.ROBOT_STATE.robot[index].self_data.is_active)
      ) {
        res = true;
      }
      return res;
    },
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

        if (THAT.LOGIC_UI_STATE.rotate_field) {
          THAT.FIELD_STATE.mouse_pointer_x = this.ROBOT_STATE.reflectMatrixX(
            THAT.FIELD_STATE.mouse_pointer_x
          );
          THAT.FIELD_STATE.mouse_pointer_y = this.ROBOT_STATE.reflectMatrixY(
            THAT.FIELD_STATE.mouse_pointer_y
          );
        }

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
            THAT.ROBOT_STATE.thetaOffset().toString() +
              THAT.LOGIC_UI_STATE.n_robot_manual.toString()
          );
        } else if (THAT.LOGIC_UI_STATE.status_offset) {
          THAT.FIELD_STATE.robot_offset.y = THAT.ROBOT_STATE.posYNoRotate(
            THAT.FIELD_STATE.mouse_pointer_x
          );
          THAT.FIELD_STATE.robot_offset.x = THAT.ROBOT_STATE.posXNoRotate(
            THAT.FIELD_STATE.mouse_pointer_y
          );
        }
        if (this.LOGIC_UI_STATE.rotate_field) {
          THAT.FIELD_STATE.robot_offset.y = THAT.ROBOT_STATE.posYWithRotate(
            THAT.FIELD_STATE.mouse_pointer_x
          );
          THAT.FIELD_STATE.robot_offset.x = THAT.ROBOT_STATE.posXWithRotate(
            THAT.FIELD_STATE.mouse_pointer_y
          );
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
          if (ROTATE_FIELD) {
            THAT.FIELD_STATE.field_config.image.src =
              lapanganRegionalWithRotateNew;
          } else {
            THAT.FIELD_STATE.field_config.image.src =
              lapanganRegionalNoRotateNew;
          }
          // this.FIELD_STATE.field_config.image.src = lapanganRegionalNoRotate;
        } else if (this.field == "nasional") {
          if (ROTATE_FIELD) {
            THAT.FIELD_STATE.field_config.image.src =
              lapanganNasionalWithRotate;
          } else {
            THAT.FIELD_STATE.field_config.image.src = lapanganNasionalNoRotate;
          }
        } else if (this.field == "tianjin") {
          if (ROTATE_FIELD) {
            THAT.FIELD_STATE.field_config.image.src = lapanganTianjinWithRotate;
          } else {
            THAT.FIELD_STATE.field_config.image.src = lapanganTianjinNoRotate;
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
