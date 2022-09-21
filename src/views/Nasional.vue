<template>
  <div class="grid min-h-screen">
    <div class="grid grid-cols-12 items-center">
      <div class="col-span-3">
        <robot-dialog />
      </div>
      <div id="container-stage" class="col-span-6">
        <field />
      </div>
      <div class="col-span-3">
        <command-widget />
      </div>
    </div>
    <div class="">2</div>
  </div>
</template>

<script>
import RobotDialog from "../components/RobotDialog.vue";
import Field from "../components/Field.vue";
import CommandWidget from "../components/CommandWidget.vue";
import RobotWidget from "../components/RobotWidget.vue";
import { useRobot } from "../stores/store";

export default {
  components: {
    RobotDialog,
    Field,
    CommandWidget,
    RobotWidget,
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
