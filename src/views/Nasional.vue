<template>
  <div>
    <v-row>
      <v-col xs="12" sm="12" md="3" class="align-self-center">
        <RobotDialog />
      </v-col>
      <v-col
        xs="12"
        sm="12"
        md="6"
        class="align-self-center"
        id="container-stage"
      >
        <field />
      </v-col>
      <v-col xs="12" sm="12" md="3" class="align-self-center">
        <CommandWidget />
      </v-col>
    </v-row>
    <v-row xs="12" sm="12" md="3" class="align-self-center">
      <!-- ini row ke 2 -->
      <v-col v-for="(robot, index) in ROBOT_STATE.robot" :key="index">
        <RobotWidget :robot_order="index" />
      </v-col>
    </v-row>
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
