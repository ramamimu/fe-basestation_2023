<template>
  <th
    class="cursor-pointer text-sm text-white"
    :class="[`${no_hover} hover:${with_hover}`]"
    @click="ROBOT_STATE.setAutoCmdInverse(num_robot - 1)"
  >
    {{ num_robot }}
  </th>
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
    num_robot: {
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
