<template>
  <div class="col-span-3 mx-auto w-full self-start">
    <StatusCommand />
    <!-- toggles -->
    <div
      class="align-start m-2 flex flex-row flex-wrap justify-center gap-3 px-2"
    >
      <div
        :class="[setButtonClass(LOGIC_UI_STATE.is_obs)]"
        @click="LOGIC_UI_STATE.is_obs = !LOGIC_UI_STATE.is_obs"
      >
        OBS
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
      <div
        class="inline-block cursor-pointer select-none bg-red-600 p-2 font-bold text-white hover:bg-red-700"
        @click="ROBOT_STATE.randomObs()"
      >
        random
      </div>
      <router-link
        class="inline-block cursor-pointer select-none bg-red-600 p-2 font-bold text-white hover:bg-red-700"
        to="/history"
      >
        history
      </router-link>
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
    <OnlineCommand />
  </div>
</template>

<script>
import { useRobot, useLogicUI, useField } from "../stores/store";
import Config from "../config/setup.json";
import CommandButton from "./commandwidget/CommandButton.vue";
import OnlineCommand from "./commandwidget/OnlineCommand.vue";
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
    OnlineCommand,
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
