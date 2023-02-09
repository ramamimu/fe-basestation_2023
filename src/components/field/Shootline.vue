<template>
  <v-line :config="FIELD_STATE.line_config[index_robot]"></v-line>
</template>

<script>
import { useField, useLogicUI, useRobot } from "../../stores/store";

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
    index_robot: {
      type: Number,
      required: true,
    },
  },
};
</script>
