<template>
  <div class="w-full">
    <div class="card flex flex-col overflow-auto">
      <div class="flex w-full flex-row flex-wrap justify-between px-2">
        <div class="">
          <h2>
            <span class="font-bold">CAPSLOCK</span>:
            <span
              class="font-bold text-red-500"
              :class="{
                'text-red-500': LOGIC_UI_STATE.capslock == false,
                'text-green-500': LOGIC_UI_STATE.capslock == true,
              }"
              >{{ LOGIC_UI_STATE.capslock }}</span
            >
          </h2>
          <p>
            Style:
            <span class="font-bold text-red-500">
              {{ ROBOT_STATE.ui_to_server.style }} ||
              {{ String.fromCharCode(ROBOT_STATE.ui_to_server.style) }}
            </span>
          </p>
          <p>
            Header:
            <span class="font-bold text-red-500">
              {{ ROBOT_STATE.ui_to_server.header_manual }}
            </span>
          </p>
        </div>
        <div class="">
          <p>
            Refbox:
            <span
              class="font-bold text-red-500"
              :class="{
                'text-red-500': ROBOT_STATE.refbox.status == false,
                'text-green-500': ROBOT_STATE.refbox.status == true,
              }"
            >
              {{ ROBOT_STATE.refbox.status }}
            </span>
          </p>
          <p>
            Command Refbox:
            <span class="font-bold text-red-500">
              {{
                ROBOT_STATE.refbox.status
                  ? `${ROBOT_STATE.refbox.message.command}`
                  : ""
              }}
            </span>
          </p>
          <p>
            Target Command:
            <span class="font-bold text-red-500">
              {{
                ROBOT_STATE.refbox.status
                  ? `${ROBOT_STATE.refbox.message.targetTeam}`
                  : ""
              }}
            </span>
          </p>
          <p class="w-fit font-bold">
            Mode:
            <span class="font-bold"> </span>
          </p>
        </div>
      </div>
      <div class="ite flex w-full flex-col justify-around px-2">
        <h5>
          Command:
          <span>
            {{ LOGIC_UI_STATE.command.character }}
            ||
            {{ LOGIC_UI_STATE.command.character.charCodeAt(0) }}
            ||
            {{ LOGIC_UI_STATE.command.text }}
            ||
            {{ LOGIC_UI_STATE.command.scope }}
          </span>
        </h5>
        <h5>
          Robot Offset:
          <span>
            {{
              LOGIC_UI_STATE.status_offset
                ? `${FIELD_STATE.mouse_pointer_x} || ${FIELD_STATE.mouse_pointer_y}`
                : "0 || 0"
            }}{{
              ` || ${LOGIC_UI_STATE.status_offset} || ${LOGIC_UI_STATE.n_robot_offset}`
            }}
          </span>
        </h5>
        <h5>
          Robot Manual:
          <span>
            {{
              `${ROBOT_STATE.ui_to_server.target_manual_x} || ${ROBOT_STATE.ui_to_server.target_manual_y} || ${LOGIC_UI_STATE.status_manual} || ${LOGIC_UI_STATE.n_robot_manual}`
            }}
          </span>
        </h5>
        <h5>
          Theta Offset:
          <span>
            {{ ROBOT_STATE.thetaOffset() }}
          </span>
        </h5>
      </div>
    </div>
    <!-- toggles -->
    <div class="align-start m-2 flex flex-row flex-wrap justify-evenly">
      <SettingButton
        v-for="(button, index) in buttons"
        :key="index"
        :title="button.title"
        :data="button.data"
      />
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
    <div class="card flex flex-row flex-wrap justify-center overflow-hidden">
      <!-- home -->
      <div class="flex flex-col">
        <CommandButton
          v-for="(command, index) in commands"
          :key="index"
          :message="command.message"
          :command="command.home"
        />
      </div>
      <!-- all -->
      <div class="flex flex-col">
        <CommandButton
          v-for="(command, index) in commands_play"
          :key="index"
          :message="command.message"
          :command="command.rule"
        />
      </div>
      <!-- away -->
      <div class="flex flex-col">
        <CommandButton
          v-for="(command, index) in commands"
          :key="index"
          :message="command.message"
          :command="command.away"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useRobot, useLogicUI, useField } from "../stores/store";
import Config from "../config/setup.json";
import CommandButton from "./commandwidget/CommandButton.vue";
import SettingButton from "./commandwidget/SettingButton.vue";

export default {
  data() {
    return {
      Config,
      commands: [
        {
          message: "Kick Off",
          home: "K",
          away: "k",
        },
        {
          message: "Free Kick",
          home: "F",
          away: "f",
        },
        {
          message: "Goal Kick",
          home: "G",
          away: "g",
        },
        {
          message: "Corner Kick",
          home: "C",
          away: "c",
        },
        {
          message: "Penalty",
          home: "P",
          away: "p",
        },
        {
          message: "Throw In",
          home: "T",
          away: "t",
        },
      ],
      commands_play: [
        {
          message: "Start",
          rule: "s",
        },
        {
          message: "Stop",
          rule: "S",
        },
        {
          message: "Drop Ball",
          rule: "N",
        },
        {
          message: "Park",
          rule: "L",
        },
        {
          message: "Kalibrasi",
          rule: "#",
        },
      ],
    };
  },
  setup() {
    const ROBOT_STATE = useRobot();
    const LOGIC_UI_STATE = useLogicUI();
    const FIELD_STATE = useField();

    let buttons = [
      {
        title: "Refbox",
        data: ROBOT_STATE.ui_to_server.connect_refbox,
      },
      {
        title: "Override",
        data: LOGIC_UI_STATE.override_mode,
      },
      {
        title: "Kalibrasi",
        data: ROBOT_STATE.ui_to_server.auto_kalibrasi,
      },
      {
        title: "show",
        data: LOGIC_UI_STATE.is_show_before_linked,
      },
    ];

    return {
      ROBOT_STATE,
      LOGIC_UI_STATE,
      FIELD_STATE,
      buttons,
    };
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
    SettingButton,
  },
};
</script>
