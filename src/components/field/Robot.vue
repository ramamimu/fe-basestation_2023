<template>
  <v-image
    :ref="`robot_icp${index_robot + 1}`"
    :config="FIELD_STATE[identifier][index_robot]"
  ></v-image>
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
    identifier: {
      type: String,
      required: true,
    },
  },
};
</script>
