<template>
  <div class="w-full">
    <div class="card flex flex-col">
      <h5>
        Command:
        <span
          >{{ String.fromCharCode(ROBOT_STATE.ui_to_server.command) }} ||
          {{ ROBOT_STATE.ui_to_server.command }} ||
          {{
            ROBOT_STATE.command_translattor[
              String.fromCharCode(ROBOT_STATE.ui_to_server.command)
            ].text
          }}
          ||
          {{
            ROBOT_STATE.command_translattor[
              String.fromCharCode(ROBOT_STATE.ui_to_server.command)
            ].scope
          }}
        </span>
      </h5>
      <h5>
        Robot Offset:
        <span>
          {{
            LOGIC_UI_STATE.status_offset
              ? `${FIELD_STATE.mouse_pointer_x} || ${FIELD_STATE.mouse_pointer_y}`
              : "0 || 0"
          }}{{ ` || ${LOGIC_UI_STATE.status_offset}` }}
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
        <span>
          {{ ROBOT_STATE.returnTheta(FIELD_STATE.robot_offset.rotation) * -1 }}
        </span>
      </h5>
    </div>
    <!-- toggles -->
    <div class="m-2">
      <div
        :class="[
          ROBOT_STATE.ui_to_server.connect_refbox
            ? 'bg-green-500 p-2'
            : 'bg-red-600 p-2',
          'inline-block cursor-pointer select-none font-bold text-white',
        ]"
        @click="
          ROBOT_STATE.ui_to_server.connect_refbox =
            !ROBOT_STATE.ui_to_server.connect_refbox
        "
      >
        Refbox
      </div>
    </div>
    <div class="card flex flex-row justify-center overflow-hidden">
      <!-- home -->
      <div class="flex flex-col">
        <button class="button" @click="ROBOT_STATE.setCommand('K')">
          Kick Off
        </button>
        <button class="button" @click="ROBOT_STATE.setCommand('F')">
          Free Kick
        </button>
        <button class="button" @click="ROBOT_STATE.setCommand('G')">
          Goal Kick
        </button>
        <button class="button" @click="ROBOT_STATE.setCommand('C')">
          Corner Kick
        </button>
        <button class="button" @click="ROBOT_STATE.setCommand('P')">
          Penalty
        </button>
        <button class="button" @click="ROBOT_STATE.setCommand('T')">
          Throw In
        </button>
      </div>
      <!-- all -->
      <div class="flex flex-col">
        <button class="button" @click="ROBOT_STATE.setCommand('s')">
          Start
        </button>
        <button class="button" @click="ROBOT_STATE.setCommand('S')">
          Stop
        </button>
        <button class="button" @click="ROBOT_STATE.setCommand('N')">
          Drop Ball
        </button>
        <button class="button" @click="ROBOT_STATE.setCommand('L')">
          Park
        </button>
        <button class="button" @click="ROBOT_STATE.setCommand('#')">
          Kalibrasi
        </button>
      </div>
      <!-- away -->
      <div class="flex flex-col">
        <button class="button" @click="ROBOT_STATE.setCommand('k')">
          Kick Off
        </button>
        <button class="button" @click="ROBOT_STATE.setCommand('f')">
          Free Kick
        </button>
        <button class="button" @click="ROBOT_STATE.setCommand('g')">
          Goal Kick
        </button>
        <button class="button" @click="ROBOT_STATE.setCommand('c')">
          Corner Kick
        </button>
        <button class="button" @click="ROBOT_STATE.setCommand('p')">
          Penalty
        </button>
        <button class="button" @click="ROBOT_STATE.setCommand('t')">
          Throw In
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRobot, useLogicUI, useField } from "../stores/store";
export default {
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
};
</script>
