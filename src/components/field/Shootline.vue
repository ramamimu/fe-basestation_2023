<template>
  <v-line :config="FIELD_STATE.line_config[index_robot]"></v-line>
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
