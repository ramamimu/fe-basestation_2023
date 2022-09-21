<template>
  <div class="col-span-3">
    <div
      class="grid grid-cols-2 overflow-scroll p-3 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
    >
      <h5>
        Command:
        <span class="red--text"
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
        <span class="red--text">
          {{
            LOGIC_UI_STATE.status_offset
              ? `${FIELD_STATE.mouse_pointer_x} || ${FIELD_STATE.mouse_pointer_y}`
              : "0 || 0"
          }}{{ ` || ${LOGIC_UI_STATE.status_offset}` }}
        </span>
      </h5>
      <h5>
        Robot Manual:
        <span class="red--text">
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
    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="blue"
      dark
      @click="ROBOT_STATE.setCommand('K')"
    >
      Kick Off
    </button>
    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="blue"
      dark
      @click="ROBOT_STATE.setCommand('F')"
    >
      Free Kick
    </button>
    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="blue"
      dark
      @click="ROBOT_STATE.setCommand('G')"
    >
      Goal Kick
    </button>
    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="blue"
      dark
      @click="ROBOT_STATE.setCommand('C')"
    >
      Corner Kick
    </button>
    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="blue"
      dark
      @click="ROBOT_STATE.setCommand('P')"
    >
      Penalty
    </button>
    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="blue"
      dark
      @click="ROBOT_STATE.setCommand('T')"
    >
      Throw In
    </button>

    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="black"
      dark
      @click="ROBOT_STATE.setCommand('S')"
    >
      Stop
    </button>
    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="black"
      dark
      ref="start"
      @click="ROBOT_STATE.setCommand('s')"
    >
      Start
    </button>
    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="black"
      dark
      @click="ROBOT_STATE.setCommand('N')"
    >
      Drop Ball
    </button>
    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="black"
      dark
      @click="ROBOT_STATE.setCommand('L')"
    >
      Park
    </button>
    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="black"
      dark
      @click="ROBOT_STATE.setCommand('#')"
    >
      Kalibrasi
    </button>

    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="error"
      @click="ROBOT_STATE.setCommand('k')"
    >
      Kick Off
    </button>
    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="error"
      @click="ROBOT_STATE.setCommand('f')"
    >
      Free Kick
    </button>
    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="error"
      @click="ROBOT_STATE.setCommand('g')"
    >
      Goal Kick
    </button>
    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="error"
      @click="ROBOT_STATE.setCommand('c')"
    >
      Corner Kick
    </button>
    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="error"
      @click="ROBOT_STATE.setCommand('p')"
    >
      Penalty
    </button>
    <button
      outlined
      class="py-5 my-1"
      x-small
      block
      color="error"
      @click="ROBOT_STATE.setCommand('t')"
    >
      Throw In
    </button>
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
