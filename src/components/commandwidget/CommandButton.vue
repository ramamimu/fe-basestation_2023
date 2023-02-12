<template>
  <button
    class="button hover:bg-slate-100"
    @click="ROBOT_STATE.setCommand(command)"
  >
    {{ message }}
  </button>
</template>

<script>
import { useRobot } from "../../stores/store";

export default {
  setup() {
    const ROBOT_STATE = useRobot();
    return {
      ROBOT_STATE,
    };
  },
  props: {
    message: {
      type: String,
      required: true,
    },
    command: {
      type: String,
      required: true,
    },
  },
};
</script>
