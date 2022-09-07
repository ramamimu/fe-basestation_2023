<template>
  <v-sheet height="100%" class="overflow-auto" style="position: relative">
    <p>IRIS Basestation</p>
    <v-divider></v-divider>
  </v-sheet>
</template>

<script>
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
};
</script>
