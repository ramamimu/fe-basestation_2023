<template>
  <div class="card flex flex-col overflow-auto">
    <div class="grid grid-cols-2 gap-3 px-2">
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
          Cmd Refbox:
          <span class="font-bold text-red-500">
            {{
              ROBOT_STATE.refbox.status
                ? `${ROBOT_STATE.refbox.message.command}`
                : ""
            }}
          </span>
        </p>
        <p>
          Target Cmd:
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
          <span class="font-bold" v-if="Config.is_2019">
            {{ Config.mode }}
          </span>
        </p>
        <p class="w-fit font-bold">
          Goal:
          <span class="font-bold">
            {{ ROBOT_STATE.refbox.message.goal }}
          </span>
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
            `${ROBOT_STATE.ui_to_server.target_manual_x} || ${ROBOT_STATE.ui_to_server.target_manual_y} ||
                    ${LOGIC_UI_STATE.status_manual} || ${LOGIC_UI_STATE.n_robot_manual}`
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
</template>

<script>
import { useRobot, useLogicUI, useField } from "../../stores/store";
import Config from "../../config/setup.json";

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
};
</script>
