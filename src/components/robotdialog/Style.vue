<template>
  <td
    style="font-size: 15px; cursor: pointer"
    @click="ROBOT_STATE.changeStyle(num_style)"
    class="orange white--text center font-bold text-white"
    :class="[`${no_hover} hover:${with_hover}`]"
  >
    {{ String.fromCharCode(num_style) }}
  </td>
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
    num_style: {
      type: Number,
      default: 0,
    },
    no_hover: {
      type: String,
      required: true,
    },
    with_hover: {
      type: String,
      required: true,
    },
  },
};
</script>
