<template>
  <viewer field="tianjin">
    <cmd-widget-offline />
  </viewer>
</template>

<script>
import Viewer from "../components/Viewer.vue";
import CmdWidgetOffline from "../components/CmdWidgetOffline.vue";

export default {
  components: {
    Viewer,
    CmdWidgetOffline,
  },
};
</script>
