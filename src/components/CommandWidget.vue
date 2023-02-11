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
      <div
        :class="[
          ROBOT_STATE.ui_to_server.connect_refbox
            ? 'bg-green-500 p-2 hover:bg-green-600'
            : 'bg-red-600 p-2 hover:bg-red-700',
          'inline-block cursor-pointer select-none font-bold text-white',
        ]"
        @click="
          ROBOT_STATE.ui_to_server.connect_refbox =
            !ROBOT_STATE.ui_to_server.connect_refbox
        "
      >
        Refbox
      </div>
      <div
        :class="[
          LOGIC_UI_STATE.override_mode
            ? 'bg-green-500 p-2 hover:bg-green-600'
            : 'bg-red-600 p-2 hover:bg-red-700',
          'inline-block cursor-pointer select-none font-bold text-white',
        ]"
        @click="LOGIC_UI_STATE.override_mode = !LOGIC_UI_STATE.override_mode"
      >
        Override
      </div>
      <div
        :class="[
          ROBOT_STATE.ui_to_server.auto_kalibrasi
            ? 'bg-green-500 p-2 hover:bg-green-600'
            : 'bg-red-600 p-2 hover:bg-red-700',
          'inline-block cursor-pointer select-none font-bold text-white',
        ]"
        @click="
          ROBOT_STATE.ui_to_server.auto_kalibrasi =
            !ROBOT_STATE.ui_to_server.auto_kalibrasi
        "
      >
        Kalibrasi
      </div>
      <div
        :class="[
          LOGIC_UI_STATE.is_show_before_linked
            ? 'bg-green-500 p-2 hover:bg-green-600'
            : 'bg-red-600 p-2 hover:bg-red-700',
          'inline-block cursor-pointer select-none font-bold text-white',
        ]"
        @click="
          LOGIC_UI_STATE.is_show_before_linked =
            !LOGIC_UI_STATE.is_show_before_linked
        "
      >
        show
      </div>
    </div>
    <div class="card flex flex-row flex-wrap justify-center overflow-hidden">
      <!-- home -->
      <div class="flex flex-col">
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('K')"
        >
          Kick Off
        </button>
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('F')"
        >
          Free Kick
        </button>
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('G')"
        >
          Goal Kick
        </button>
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('C')"
        >
          Corner Kick
        </button>
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('P')"
        >
          Penalty
        </button>
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('T')"
        >
          Throw In
        </button>
      </div>
      <!-- all -->
      <div class="flex flex-col">
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('s')"
        >
          Start
        </button>
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('S')"
        >
          Stop
        </button>
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('N')"
        >
          Drop Ball
        </button>
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('L')"
        >
          Park
        </button>
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('#')"
        >
          Kalibrasi
        </button>
      </div>
      <!-- away -->
      <div class="flex flex-col">
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('k')"
        >
          Kick Off
        </button>
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('f')"
        >
          Free Kick
        </button>
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('g')"
        >
          Goal Kick
        </button>
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('c')"
        >
          Corner Kick
        </button>
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('p')"
        >
          Penalty
        </button>
        <button
          class="button hover:bg-slate-100"
          @click="ROBOT_STATE.setCommand('t')"
        >
          Throw In
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRobot, useLogicUI, useField } from "../stores/store";
import Config from "../config/setup.json";
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
