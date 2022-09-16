<template>
  <div>
    <v-row>
      <v-col>
        <h2>
          Capslock:
          <span> </span>
        </h2>
        <h5>
          Style:
          <span class="red--text">
            {{ ROBOT_STATE.ui_to_server.style }} |
            {{ String.fromCharCode(ROBOT_STATE.ui_to_server.style) }}
          </span>
        </h5>

        <h5>
          Header:
          <span class="red--text">
            {{ ROBOT_STATE.ui_to_server.header }}
          </span>
        </h5>

        <h5>
          Status MCL:
          <span class="red--text"> </span>
        </h5>
      </v-col>
      <v-col>
        <h5 class="mt-3">
          Refbox:
          <span class="red--text"> </span>
        </h5>
        <h5>
          Command Refbox:
          <span class="red--text"> </span>
        </h5>
        <h5>
          Target Command:
          <span class="red--text"> </span>
        </h5>
        <h5 style="cursor: pointer">
          <span> MODE </span>
          <span> : </span>
        </h5>
      </v-col>
    </v-row>
    <v-divider></v-divider>
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
    <v-row>
      <v-col class="px-1">
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="blue"
          dark
          @click="ROBOT_STATE.setCommand('K')"
          >Kick Off</v-btn
        >
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="blue"
          dark
          @click="ROBOT_STATE.setCommand('F')"
          >Free Kick</v-btn
        >
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="blue"
          dark
          @click="ROBOT_STATE.setCommand('G')"
          >Goal Kick
        </v-btn>
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="blue"
          dark
          @click="ROBOT_STATE.setCommand('C')"
        >
          Corner Kick
        </v-btn>
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="blue"
          dark
          @click="ROBOT_STATE.setCommand('P')"
        >
          Penalty
        </v-btn>
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="blue"
          dark
          @click="ROBOT_STATE.setCommand('T')"
        >
          Throw In
        </v-btn>
      </v-col>
      <v-col class="px-1">
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="black"
          dark
          @click="ROBOT_STATE.setCommand('S')"
          >Stop</v-btn
        >
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="black"
          dark
          ref="start"
          @click="ROBOT_STATE.setCommand('s')"
          >Start</v-btn
        >
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="black"
          dark
          @click="ROBOT_STATE.setCommand('N')"
          >Drop Ball</v-btn
        >
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="black"
          dark
          @click="ROBOT_STATE.setCommand('L')"
        >
          Park
        </v-btn>
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="black"
          dark
          @click="ROBOT_STATE.setCommand('#')"
        >
          Kalibrasi
        </v-btn>
      </v-col>
      <v-col class="px-1">
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="error"
          @click="ROBOT_STATE.setCommand('k')"
          >Kick Off</v-btn
        >
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="error"
          @click="ROBOT_STATE.setCommand('f')"
          >Free Kick</v-btn
        >
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="error"
          @click="ROBOT_STATE.setCommand('g')"
        >
          Goal Kick
        </v-btn>
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="error"
          @click="ROBOT_STATE.setCommand('c')"
        >
          Corner Kick
        </v-btn>
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="error"
          @click="ROBOT_STATE.setCommand('p')"
        >
          Penalty
        </v-btn>
        <v-btn
          outlined
          class="py-5 my-1"
          x-small
          block
          color="error"
          @click="ROBOT_STATE.setCommand('t')"
        >
          Throw In
        </v-btn>
      </v-col>
    </v-row>
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
