<template>
  <template
    v-for="(obs, index) in ROBOT_STATE.robot[index_robot].pc2bs_data.obs_dist"
    :key="index"
  >
    <v-circle
      :ref="`robot${index_robot + 1}_obs_${index}`"
      :config="
        index_robot == 0
          ? obs_robot_1[index]
          : index_robot == 1
          ? obs_robot_2[index]
          : index_robot == 2
          ? obs_robot_3[index]
          : index_robot == 3
          ? obs_robot_4[index]
          : obs_robot_5[index]
      "
    ></v-circle>
  </template>
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
    index_robot: {
      type: Number,
      required: true,
    },
    obs_robot_1: {
      type: Array,
      required: true,
    },
    obs_robot_2: {
      type: Array,
      required: true,
    },
    obs_robot_3: {
      type: Array,
      required: true,
    },
    obs_robot_4: {
      type: Array,
      required: true,
    },
    obs_robot_5: {
      type: Array,
      required: true,
    },
  },
};
</script>
