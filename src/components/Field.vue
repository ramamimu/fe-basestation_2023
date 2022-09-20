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
          <!-- <v-image ref="ball1" :config="FIELD_STATE.ball_orobot_offset"></v-image> -->
        </template>
        <!-- SHOOTLINE -->
        <template>
          <v-line :config="FIELD_STATE.line_config[0]"></v-line>
        </template>
        <template>
          <v-line :config="FIELD_STATE.line_config[1]"></v-line>
        </template>
        <template>
          <v-line :config="FIELD_STATE.line_config[2]"></v-line>
        </template>
        <template>
          <v-line :config="FIELD_STATE.line_config[3]"></v-line>
        </template>
        <template>
          <v-line :config="FIELD_STATE.line_config[4]"></v-line>
        </template>

        <!-- ROBOT & BOLA 1 -->
        <template>
          <v-image ref="robot1" :config="FIELD_STATE.robot_config[0]"></v-image>
          <v-image ref="ball1" :config="FIELD_STATE.ball_config[0]"></v-image>
        </template>

        <!-- ROBOT & BOLA 2 -->
        <template>
          <v-image ref="robot2" :config="FIELD_STATE.robot_config[1]"></v-image>
          <v-image ref="ball2" :config="FIELD_STATE.ball_config[1]"></v-image>
        </template>

        <!-- ROBOT & BOLA 3 -->
        <template>
          <v-image ref="robot3" :config="FIELD_STATE.robot_config[2]"></v-image>
          <v-image ref="ball3" :config="FIELD_STATE.ball_config[2]"></v-image>
        </template>

        <!-- ROBOT & BOLA 4 -->
        <template>
          <v-image ref="robot4" :config="FIELD_STATE.robot_config[3]"></v-image>
          <v-image ref="ball4" :config="FIELD_STATE.ball_config[3]"></v-image>
        </template>

        <!-- ROBOT & BOLA 5 -->
        <template>
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

import greenRobot from "../assets/Model_IRIS_Basestaton/Green Model/green.png";

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
  created() {
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

    if (this.LOGIC_UI_STATE.rotate_field) {
      this.FIELD_STATE.field_config.image.src = lapanganNasionalNoRotate;
    } else {
      this.FIELD_STATE.field_config.image.src = lapanganNasionalWithRotate;
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
        const CONTAINER_WIDTH = CONTAINER.offsetWidth - 25;
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

      for (let i = 0; i < LEN_ROBOT; i++) {
        ROBOT_CONFIG[i].y = THAT.posYNoRotate(ROBOT[i].pc2bs_data.pos_y);
        ROBOT_CONFIG[i].x = THAT.posXNoRotate(ROBOT[i].pc2bs_data.pos_x);
        ROBOT_CONFIG[i].rotation = THAT.thetaNoRotate(
          ROBOT[i].pc2bs_data.theta
        );

        BALL_CONFIG[i].x = THAT.posXNoRotate(ROBOT[i].pc2bs_data.bola_x);
        BALL_CONFIG[i].y = THAT.posYNoRotate(ROBOT[i].pc2bs_data.bola_y);

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
    posXNoRotate(pos_x) {
      let THAT = this;
      return pos_x + THAT.FIELD_STATE.padding_tunning_x;
    },
    posYNoRotate(pos_y) {
      let THAT = this;
      return pos_y + THAT.FIELD_STATE.padding_tunning_y;
    },
    thetaNoRotate(theta) {
      return theta * -1;
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
        let field = THAT.FIELD_STATE.field_config;
        let stage = THAT.FIELD_STATE.stage_config;

        THAT.FIELD_STATE.mouse_pointer_x = Math.floor(
          (stage.height / THAT.$refs.stage.getNode().attrs.height) * y -
            THAT.FIELD_STATE.padding_tunning_y
        );
        THAT.FIELD_STATE.mouse_pointer_y = Math.floor(
          (stage.width / THAT.$refs.stage.getNode().attrs.width) * x -
            THAT.FIELD_STATE.padding_tunning_x
        );

        if (THAT.LOGIC_UI_STATE.status_manual) {
          THAT.FIELD_STATE.robot_offset.y = THAT.posXNoRotate(
            THAT.FIELD_STATE.mouse_pointer_x
          );
          THAT.FIELD_STATE.robot_offset.x = THAT.posYNoRotate(
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
            THAT.thetaNoRotate(
              THAT.ROBOT_STATE.returnTheta(
                THAT.FIELD_STATE.robot_offset.rotation
              )
            ).toString() + THAT.LOGIC_UI_STATE.n_robot_manual.toString()
          );
        } else if (THAT.LOGIC_UI_STATE.status_offset) {
          THAT.FIELD_STATE.robot_offset.y = THAT.posYNoRotate(
            THAT.FIELD_STATE.mouse_pointer_x
          );
          THAT.FIELD_STATE.robot_offset.x = THAT.posXNoRotate(
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
    ROBOT_STATE: {
      handler() {
        const THAT = this;
        if (THAT.LOGIC_UI_STATE.status_manual) {
          THAT.ROBOT_STATE.ui_to_server.target_manual_theta = parseInt(
            THAT.thetaNoRotate(
              THAT.ROBOT_STATE.returnTheta(
                THAT.FIELD_STATE.robot_offset.rotation
              )
            ).toString() + THAT.LOGIC_UI_STATE.n_robot_manual.toString()
          );
        }
      },
      deep: true,
    },
  },
};
</script>
