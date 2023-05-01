<template>
  <viewer field="regional">
    <cmd-widget-online />
  </viewer>
</template>

<script>
import Viewer from "../components/Viewer.vue";
import CmdWidgetOnline from "../components/CmdWidgetOnline.vue";

export default {
  components: {
    Viewer,
    CmdWidgetOnline,
  },
};
</script>
