<template>
  <div class="min-h-screen pb-2">
    <div class="grid-cols-12 content-center justify-items-stretch xl:grid">
      <robot-dialog
        class="col-span-3"
        :class="{
          'self-center': field != 'regional',
          'self-start': field == 'regional',
        }"
      />
      <field
        :field="field"
        id="container-stage"
        class="col-span-6 row-span-8"
      />
      <!-- <command-widget
        :field="field"
        class="col-span-3 mx-auto"
        :class="{
          'self-center': field != 'regional',
          'self-start': field == 'regional',
        }"
      /> -->
      <slot></slot>
      <div
        class="col-span-12 flex flex-row flex-wrap justify-evenly md:flex md:shrink-0"
      >
        <div v-for="(robot, index) in ROBOT_STATE.robot" :key="index">
          <RobotWidget :robot_order="index" class="col-span-2 mt-4" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRobot } from "../stores/store";
import RobotDialog from "./RobotDialog.vue";
import RobotWidget from "./RobotWidget.vue";
import Field from "../components/Field.vue";

export default {
  components: {
    RobotDialog,
    RobotWidget,
    Field,
  },
  setup() {
    const ROBOT_STATE = useRobot();
    return {
      ROBOT_STATE,
    };
  },
  props: {
    field: {
      type: String,
      default: "nasional",
    },
  },
};
</script>
