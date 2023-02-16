<template>
  <v-image
    :ref="`ball${index_robot + 1}`"
    :config="FIELD_STATE.ball_config[index_robot]"
  ></v-image>
</template>

<script>
import { useField } from "../../stores/store";

export default {
  setup() {
    const FIELD_STATE = useField();
    return {
      FIELD_STATE,
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
