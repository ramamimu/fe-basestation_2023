<template>
  <div class="min-h-screen sm:grid md:grid lg:grid xl:grid 2xl:grid">
    <div
      class="grid-rows-12 grid-cols-12 content-center justify-items-stretch md:grid"
    >
      <robot-dialog class="col-span-3 row-span-8" />
      <field id="container-stage" class="col-span-6 row-span-8" />
      <command-widget class="col-span-3 row-span-8 mx-auto self-start pt-10" />
      <div
        class="col-span-12 row-span-4 flex flex-row flex-wrap justify-evenly md:flex md:shrink-0"
      >
        <div v-for="(robot, index) in ROBOT_STATE.robot" :key="index">
          <RobotWidget :robot_order="index" class="col-span-2 mt-4" />
        </div>
      </div>
    </div>
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
