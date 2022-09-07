<template>
  <div ref="container">
    <v-stage ref="stage" :config="FIELD_STATE.stage_config">
      <v-layer ref="layer">
        <v-image ref="field" :config="FIELD_STATE.field_config" />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import { useField, useLogicUI } from "../stores/store";
import lapanganNasionalNoRotate from "../assets/Lapangan_nasional_v2.png";
import lapanganNasionalWithRotate from "../assets/Lapangan_nasional_v2_rotate.png";
import Konva from "konva";

export default {
  setup() {
    const FIELD_STATE = useField();
    const LOGIC_UI_STATE = useLogicUI();
    return {
      FIELD_STATE,
      LOGIC_UI_STATE,
    };
  },
  created() {
    this.FIELD_STATE.padding_tunning_x = 110;
    this.FIELD_STATE.padding_tunning_y = 100;
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
    });

    anim.start();
  },
};
</script>
