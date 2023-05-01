<template>
  <div class="col-span-3 mx-auto w-full self-center">
    <StatusCommand />
    <!-- toggles -->
    <div
      class="align-start m-2 flex flex-row flex-wrap justify-center gap-3 px-2"
    >
      <div
        :class="[setButtonClass(ROBOT_STATE.ui_to_server.connect_refbox)]"
        @click="
          ROBOT_STATE.ui_to_server.connect_refbox =
            !ROBOT_STATE.ui_to_server.connect_refbox
        "
      >
        Refbox
      </div>
      <div
        :class="[setButtonClass(LOGIC_UI_STATE.override_mode)]"
        @click="LOGIC_UI_STATE.override_mode = !LOGIC_UI_STATE.override_mode"
      >
        Override
      </div>
      <div
        :class="[setButtonClass(ROBOT_STATE.ui_to_server.auto_kalibrasi)]"
        @click="
          ROBOT_STATE.ui_to_server.auto_kalibrasi =
            !ROBOT_STATE.ui_to_server.auto_kalibrasi
        "
      >
        Kalibrasi
      </div>
      <div
        :class="[setButtonClass(LOGIC_UI_STATE.is_show_before_linked)]"
        @click="
          LOGIC_UI_STATE.is_show_before_linked =
            !LOGIC_UI_STATE.is_show_before_linked
        "
      >
        show
      </div>
    </div>
    <!-- batas -->
    <div
      v-if="Config.is_shareable"
      :class="[
        LOGIC_UI_STATE.is_share_to_ui
          ? 'bg-green-500 p-2 hover:bg-green-600'
          : 'bg-red-600 p-2 hover:bg-red-700',
        'mx-2 cursor-pointer select-none border-4  text-center font-bold text-white',
      ]"
      @click="LOGIC_UI_STATE.is_share_to_ui = !LOGIC_UI_STATE.is_share_to_ui"
    >
      Share UI
    </div>
    <OfflineCommand />
  </div>
</template>

<script>
import { useRobot, useLogicUI, useField } from "../stores/store";
import Config from "../config/setup.json";
import CommandButton from "./commandwidget/CommandButton.vue";
import OfflineCommand from "./commandwidget/OfflineCommand.vue";
import StatusCommand from "./commandwidget/StatusCommand.vue";

export default {
  data() {
    return {
      Config,
    };
  },
  setup() {
    const ROBOT_STATE = useRobot();
    const LOGIC_UI_STATE = useLogicUI();
    const FIELD_STATE = useField();

    return {
      ROBOT_STATE,
      LOGIC_UI_STATE,
      FIELD_STATE,
    };
  },
  props: {
    field: {
      type: String,
      default: "nasional",
    },
  },
  mounted() {
    const THAT = this;
    if (Config.is_shareable) {
      THAT.LOGIC_UI_STATE.is_share_to_ui = false;
    } else {
      THAT.LOGIC_UI_STATE.is_share_to_ui = true;
    }
  },
  components: {
    CommandButton,
    OfflineCommand,
    StatusCommand,
  },
  methods: {
    setButtonClass(val) {
      const THAT = this;
      return (
        (val
          ? "bg-green-500 p-2 hover:bg-green-600"
          : "bg-red-600 p-2 hover:bg-red-700 ") +
        "inline-block cursor-pointer select-none font-bold text-white"
      );
    },
  },
};
</script>
