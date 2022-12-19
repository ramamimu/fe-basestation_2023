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
          THAT.FIELD_STATE.robot_offset.rotation = THAT.ROBOT_STATE.returnTheta(
            THAT.FIELD_STATE.robot_offset.rotation
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
            THAT.ROBOT_STATE.thetaNoRotate(
              THAT.ROBOT_STATE.returnTheta(
                THAT.FIELD_STATE.robot_offset.rotation
              )
            ).toString() + THAT.LOGIC_UI_STATE.n_robot_manual.toString()
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
            THAT.FIELD_STATE.field_config.image.src = lapanganNasionalNoRotate;
          } else {
            THAT.FIELD_STATE.field_config.image.src =
              lapanganNasionalWithRotate;
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
