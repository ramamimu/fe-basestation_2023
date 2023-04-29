<template>
  <field field="tianjin" id="container-stage" class="col-span-6" />
</template>

<script>
import Field from "../components/Field.vue";
import { useRobot } from "../stores/store";

export default {
  components: {
    Field,
  },
  setup() {
    const ROBOT_STATE = useRobot();
    return {
      ROBOT_STATE,
    };
  },
  data() {
    return {};
  },
};
</script>
