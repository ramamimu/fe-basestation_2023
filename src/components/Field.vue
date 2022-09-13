<template>
  <div ref="container">
    <v-stage
      ref="stage"
      :config="FIELD_STATE.stage_config"
      @click="getPosition()"
    >
      <v-layer ref="layer">
        <v-image ref="field" :config="FIELD_STATE.field_config" />
        <!-- <v-image ref="dummy-robot" :config="FIELD_STATE.dummy_robot_config" /> -->
        <v-image ref="robot1" :config="FIELD_STATE.robot_config[0]"></v-image>
        <v-image ref="robot2" :config="FIELD_STATE.robot_config[1]"></v-image>
        <v-image ref="robot3" :config="FIELD_STATE.robot_config[2]"></v-image>
        <v-image ref="robot4" :config="FIELD_STATE.robot_config[3]"></v-image>
        <v-image ref="robot5" :config="FIELD_STATE.robot_config[4]"></v-image>
        <v-image ref="ball1" :config="FIELD_STATE.ball_config[0]"></v-image>
        <v-image ref="ball2" :config="FIELD_STATE.ball_config[1]"></v-image>
        <v-image ref="ball3" :config="FIELD_STATE.ball_config[2]"></v-image>
        <v-image ref="ball4" :config="FIELD_STATE.ball_config[3]"></v-image>
        <v-image ref="ball5" :config="FIELD_STATE.ball_config[4]"></v-image>
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

    // ROBOT DUMMY
    this.FIELD_STATE.dummy_robot_config.width = 100;
    this.FIELD_STATE.dummy_robot_config.height = 100;
    this.FIELD_STATE.dummy_robot_config.offset.x = 50;
    this.FIELD_STATE.dummy_robot_config.offset.y = 50;
    this.FIELD_STATE.dummy_robot_config.image.src = greenRobot;

    // N ROBOT INITIATION
    const ROBOT_CONFIG = this.FIELD_STATE.robot_config;
    const BALL_CONFIG = this.FIELD_STATE.ball_config;
    const IMAGE_ROBOT = this.FIELD_STATE.robot_image;
    const IMAGE_BALL = this.FIELD_STATE.ball_image;
    const LEN_ROBOT = this.FIELD_STATE.robot_config.length;

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

      for (let i = 0; i < LEN_ROBOT; i++) {
        ROBOT_CONFIG[i].x = THAT.posXNoRotate(ROBOT[i].pc2bs_data.pos_x);
        ROBOT_CONFIG[i].y = THAT.posYNoRotate(ROBOT[i].pc2bs_data.pos_y);

        BALL_CONFIG[i].x = THAT.posXNoRotate(ROBOT[i].pc2bs_data.bola_x);
        BALL_CONFIG[i].y = THAT.posYNoRotate(ROBOT[i].pc2bs_data.bola_y);
      }
    });

    anim.start();

    window.addEventListener("keypress", (event) => {
      if (event.key == "o") {
        THAT.FIELD_STATE.dummy_robot_config.y -= 10;
      } else if (event.key == "l") {
        THAT.FIELD_STATE.dummy_robot_config.y += 10;
      } else if (event.key == ";") {
        THAT.FIELD_STATE.dummy_robot_config.x += 10;
      } else if (event.key == "k") {
        THAT.FIELD_STATE.dummy_robot_config.x -= 10;
      }
    });
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
      if (
        this.LOGIC_UI_STATE.status_offset ||
        this.LOGIC_UI_STATE.status_manual
      ) {
        const position = this.$refs.stage.getNode().getPointerPosition();
        const x = position.x;
        const y = position.y;
        // console.log(`x: ${x}, y: ${y}`);
        let field = this.FIELD_STATE.field_config;
        let stage = this.FIELD_STATE.stage_config;
        // configKonva = stage_config
        this.FIELD_STATE.mouse_pointer_x = Math.floor(
          (stage.height / this.$refs.stage.getNode().attrs.height) * y -
            this.FIELD_STATE.padding_tunning_y
        );
        this.FIELD_STATE.mouse_pointer_y = Math.floor(
          (stage.width / this.$refs.stage.getNode().attrs.width) * x -
            this.FIELD_STATE.padding_tunning_x
        );
        // this.ROBOT_STATE.ui_to_server.odometry_offset_robot_x = this.FIELD_STATE.mouse_pointer_x;
        // this.ROBOT_STATE.ui_to_server.odometry_offset_robot_y = this.FIELD_STATE.mouse_pointer_y;
        console.log(
          `x2: ${this.FIELD_STATE.mouse_pointer_x}, y2: ${this.FIELD_STATE.mouse_pointer_y}`
        );
      }
    },
  },
};
</script>
