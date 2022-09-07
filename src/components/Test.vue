<template>
  <div>
    <h1>UI</h1>
    <p>{{ ui }}</p>
    <!-- {{ robots }} -->
    <h1>robot 1</h1>
    <p>{{ robot[0] }}</p>
    <h1>robot 2</h1>
    <p>{{ robot[1] }}</p>
    <h1>robot 3</h1>
    <p>{{ robot[2] }}</p>
    <h1>robot 4</h1>
    <p>{{ robot[3] }}</p>
    <h1>robot 5</h1>
    <p>{{ robot[4] }}</p>
  </div>
</template>

<script>
// import { useRobotData, useUIToServerData } from "@/stores/store.js";

export default {
  setup() {
    const { robot } = useRobot();
    // const { ui } = useUIToServerData();
    return {
      robot,
      //   ui,
    };
  },
  mounted() {
    console.log(this.robot);
  },
};
</script>
