<template>
  <div class="w-full">
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
    <div
      class="card flex flex-col items-center justify-center overflow-hidden"
      v-if="field == 'regional'"
    >
      <div class="flex flex-row flex-wrap justify-center">
        <div
          @click="start"
          class="button flex cursor-pointer items-center justify-center hover:bg-slate-100"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
            ></path>
          </svg>
        </div>
        <div
          class="button flex cursor-pointer items-center justify-center hover:bg-slate-100"
          @click="resume()"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z"
            ></path>
          </svg>
        </div>
        <div
          class="button flex cursor-pointer items-center justify-center hover:bg-slate-100"
          @click="stop()"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
            ></path>
          </svg>
        </div>
      </div>
      <div
        class="flex w-full flex-row flex-wrap items-center justify-center space-x-4"
      >
        <div
          class="flex h-10 w-1/12 cursor-pointer items-center justify-center rounded-md border hover:bg-slate-100"
          @click="reset()"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            ></path>
          </svg>
        </div>
        <div
          class="relative flex w-3/5 items-center justify-center rounded-md border"
        >
          <div class="w-full bg-gray-200">
            <div
              class="h-10 w-full rounded-md bg-green-500"
              :style="{ width: `${prosen}%` }"
            ></div>
          </div>
          <p class="absolute text-center text-sm">{{ format(time) }}</p>
        </div>
        <div
          class="flex h-10 w-1/12 cursor-pointer items-center justify-center rounded-md border hover:bg-slate-100"
          @click="doLap()"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
    <div
      class="card flex flex-col flex-wrap items-center justify-center space-x-8 overflow-hidden"
      v-if="field == 'regional'"
    >
      <div
        class="card whitespace-no-wrap absolute mx-auto flex w-full max-w-sm flex-row flex-wrap items-center justify-between overflow-hidden rounded-xl bg-gray-50 p-3 text-sm font-medium leading-none shadow-lg sm:mx-auto"
        v-if="snackbar_state"
      >
        <div class="inline-flex items-center text-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2 h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          {{ snackbar_text }}
        </div>
        <div
          class="cursor-pointer text-green-700 hover:text-green-800"
          @click="snackbar_state = false"
        >
          <span
            class="item-center inline-flex flex-shrink-0 justify-center rounded-full border-l-2 border-t-2 border-green-700 p-1 leading-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>
      <span class="text-center font-bold">Time Record</span>
      <div class="flex flex-row flex-wrap justify-center space-x-8">
        <div>
          <div v-for="lap in laps" :key="lap.id" class="flex flex-col">
            <p>{{ lap.timeFromZero }}</p>
            <p>{{ lap.timeFromBefore }}</p>
          </div>
        </div>
        <div>
          <div v-for="abc in time_abc" :key="abc.cyc_id" class="flex flex-col">
            {{ abc.cyc_id + " : " + abc.timeFromBefore }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="card flex flex-row flex-wrap justify-center overflow-hidden"
      v-if="field != 'regional'"
    >
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
      // timer
      running: 0,
      pause: 0,
      time: 0,
      stopped: 0,
      minute: 0,
      second: 0,
      milis: 0,
      limit_param: 180, // in second
      laps: [],
      time_abc: [],
      lap_id: 1,
      cyc_id: 0,
      prosen: 0,
      // new
      epoch_start: null,
      epoch_elapsed: null,
      interval: null,
      dialog: false,
      snackbar_state: false,
      snackbar_text: "",
      ket_text: "",
    };
  },
  props: {
    field: {
      type: String,
      default: "nasional",
    },
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
  mounted() {
    const THAT = this;
    if (Config.is_shareable) {
      THAT.LOGIC_UI_STATE.is_share_to_ui = false;
    } else {
      THAT.LOGIC_UI_STATE.is_share_to_ui = true;
    }

    window.addEventListener("keypress", function (ev) {
      THAT.keyPress(ev);
    });
  },
  components: {
    CommandButton,
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
    timer() {
      const THAT = this;
      this.interval = setInterval(() => {
        if (THAT.running) {
          THAT.time = Math.floor(Date.now() / 10 - THAT.epoch_start / 10);
          THAT.milis = THAT.place(THAT.time % 100);
          THAT.second = THAT.place(parseInt(THAT.time / 100) % 60);
          THAT.minute = THAT.place(parseInt(THAT.time / (60 * 100)));
          THAT.prosen = Math.ceil((THAT.time / 100 / THAT.limit_param) * 100);

          // Jika > 3menit = 180 detik
          // if (THAT.time >= THAT.limit_param * 100) THAT.stop();
        }
      }, 10);
    },
    start() {
      this.epoch_start = Date.now();
      this.running = 1;
      this.pause = 0;

      this.timer();
    },
    stop() {
      // this.doLap()
      this.running = 0;
      this.pause = 0;
      clearInterval(this.interval);
    },
    reset() {
      this.time = 0;
      this.running = 0;
      this.pause = 0;
      clearInterval(this.interval);
      this.laps = [];
      this.time_abc = [];
      this.prosen = 0;
      this.cyc_id = 0;
    },
    resume() {
      this.running = 1;
      this.pause = 0;
      this.timer();
    },
    place(n) {
      return n < 10 ? "0" + n : n;
    },
    format(timeParam) {
      if (timeParam == 0) return "FIRST START";

      let localMilis = 0;
      let localSecond = 0;
      let localMinute = 0;
      localMilis = this.place(timeParam % 100);
      localSecond = this.place(parseInt(timeParam / 100) % 60);
      localMinute = this.place(parseInt(timeParam / (60 * 100)));

      return localMinute + ":" + localSecond + ":" + localMilis;
    },
    doLap() {
      if (this.time != 0 && this.running) {
        let tfz = 0;
        let tfb = 0;
        let tfbABC = 0;
        let tfzABC = 0;
        let mode = String.fromCharCode(this.ROBOT_STATE.ui_to_server.style);
        let modeConverted = "A";

        if (mode === "A") {
          // tfz = 'C: ' + this.format(this.time)
          // Add saving ABC Total Time
          tfbABC =
            this.time_abc.length >= 1
              ? this.format(
                  this.time - this.time_abc[this.time_abc.length - 1].timeValue
                )
              : this.format(this.time);
          tfzABC = this.format(this.time);

          this.time_abc.push({
            cyc_id: ++this.cyc_id,
            timeValue: this.time,
            timeFromZero: tfzABC,
            timeFromBefore: tfbABC,
          });

          modeConverted = "C";
        } else if (mode === "B") {
          modeConverted = "A";
        } else if (mode === "C") {
          modeConverted = "B";
        }

        tfb =
          this.laps.length >= 1
            ? this.format(this.time - this.laps[this.laps.length - 1].timeValue)
            : this.format(this.time);
        tfz = this.format(this.time);

        this.laps.push({
          id: this.lap_id++,
          timeValue: this.time,
          timeFromZero: modeConverted + ":" + tfz,
          timeFromBefore: "+" + tfb,
        });
      }
    },
    keyPress(ev) {
      const THAT = this;
      if (THAT.$route.path == "/regional") {
        switch (ev.key) {
          case "q":
            THAT.ROBOT_STATE.reCurrent();
            break;
          case "w":
            THAT.ROBOT_STATE.nextStyle();
            break;
          case "e":
            THAT.ROBOT_STATE.setCommand("s");
            setTimeout(() => {
              this.doLap();
            }, 100);
            break;
          case "a":
            THAT.ROBOT_STATE.changeStyle(65);
            break;
          case "s":
            THAT.ROBOT_STATE.changeStyle(66);
            break;
          case "d":
            THAT.ROBOT_STATE.changeStyle(67);
            break;
          case "f":
            THAT.start();
            THAT.ROBOT_STATE.setCommand("s");
            break;
          case "z":
            THAT.reset();
            break;
          case "x":
            THAT.resume();
            break;
          case "c":
            THAT.stop();
            break;
          case "v":
            THAT.setToLocal();
            break;
        }
      }
    },
    getFormattedDate() {
      const date = new Date();
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = `0${month}`;
      }
      let day = date.getDate();
      if (day < 10) {
        day = `0${day}`;
      }
      let hours = date.getHours();
      if (hours < 10) {
        hours = `0${hours}`;
      }
      let minutes = date.getMinutes();
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    },
    setToLocal() {
      this.snackbar_text = `${this.getFormattedDate()} saved`;
      this.snackbar_state = true;
      const THAT = this;
      let data = {
        laps: THAT.laps,
        time_abc: THAT.time_abc,
      };
      localStorage.setItem(`${this.getFormattedDate()}`, JSON.stringify(data));
      setTimeout(() => {
        THAT.snackbar_state = false;
        THAT.snackbar_text = "";
        THAT.laps = [];
        THAT.time_abc = [];
      }, 2000);
    },
  },
};
</script>
