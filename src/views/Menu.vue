<template>
  <v-sheet height="100%" class="overflow-auto" style="position: relative">
    <p>IRIS Basestation</p>
    <v-divider></v-divider>
    <v-list-item>
      <v-list-item-title>Rotate Field</v-list-item-title>
      <v-list-item-action>
        <v-switch v-model="LOGIC_UI_STATE.rotate_field"></v-switch>
      </v-list-item-action>
    </v-list-item>
  </v-sheet>
</template>

<script>
import { useLogicUI } from "@/stores/store";

export default {
  data() {
    return {
      test: true,
      items: [
        { title: "Nasional", icon: "mdi-view-dashboard" },
        { title: "Regional", icon: "mdi-forum" },
        { title: "Robocup", icon: "mdi-earth" },
      ],
      menu: false,
      ipRobot: false,
      message: false,
      hints: true,
    };
  },
  setup() {
    const LOGIC_UI_STATE = useLogicUI();
    return {
      LOGIC_UI_STATE,
    };
  },
};
</script>
