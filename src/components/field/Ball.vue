<template>
  <v-image
    :ref="`ball${index_robot + 1}`"
    :config="
      index_robot
        ? FIELD_STATE[identifier][index_robot]
        : FIELD_STATE[identifier]
    "
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
      required: false,
      default: 0,
    },
    identifier: {
      type: String,
      required: true,
    },
  },
};
</script>
