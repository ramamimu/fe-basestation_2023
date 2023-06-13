<template>
  <div
    class="w-fit max-w-sm rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="relative overflow-x-auto">
      <div class="grid grid-cols-3 grid-rows-2">
        <div
          class="cursor-pointer py-1 pl-3 align-middle"
          :class="{
            'bg-red-600 font-normal text-white hover:bg-red-700':
              !ROBOT_STATE.robot[robot_order].self_data.is_active,
            'bg-white font-bold text-green-500 hover:bg-slate-100':
              ROBOT_STATE.robot[robot_order].self_data.is_active,
          }"
          @click="ROBOT_STATE.setAutoCmd(robot_order)"
        >
          Robot {{ robot_order + 1 }}
          <!-- loading effect -->
          <!-- <div
            class="inset-0 flex items-center justify-center"
            v-if="LOGIC_UI_STATE.loading"
          >
            <div class="absolute bg-white opacity-75" aria-hidden="true"></div>
            <svg
              class="h-6 w-6 animate-spin"
              :class="{
                'text-white':
                  !ROBOT_STATE.robot[robot_order].self_data.is_active,
                'text-green-500':
                  ROBOT_STATE.robot[robot_order].self_data.is_active,
              }"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div> -->
        </div>
        <div
          class="col-span-2 row-span-2 flex h-full flex-row flex-wrap items-center justify-around"
        >
          <!-- <div class="flex flex-row flex-wrap justify-around"> -->
          <div class="relative flex h-full w-1/5 items-end rounded-md border">
            <p
              class="absolute flex h-full w-full items-center justify-center border text-sm"
            >
              {{ getBaterai() }}%
            </p>
            <div
              class="w-full rounded-sm bg-green-500"
              :style="{ height: `${getBaterai()}%` }"
            ></div>
          </div>
          <div
            type="button"
            @click="ROBOT_STATE.openControlBox(robot_order)"
            class="cursor-pointer rounded-lg border border-gray-200 bg-white py-2.5 px-5 text-lg font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200"
          >
            Control Box
          </div>
          <!-- </div> -->
        </div>
        <div
          class="cursor-pointer py-1 pl-3"
          :class="{
            'bg-red-600 font-normal text-white':
              !ROBOT_STATE.ui_to_server.status_control_robot[robot_order],
            'bg-white font-bold text-green-500':
              ROBOT_STATE.ui_to_server.status_control_robot[robot_order],
          }"
          @click="show = !show"
        >
          {{
            ROBOT_STATE.ui_to_server.status_control_robot[robot_order]
              ? "Linked"
              : "Unlinked"
          }}
        </div>
      </div>
      <!-- SLIDER -->
      <div
        class="w-fit max-w-sm rounded-lg border border-gray-200 bg-white p-4"
      >
        <!-- VELOCITY -->
        <div class="flex items-center">
          <label
            for="velocity-range"
            class="mb-2 block w-14 text-xs font-normal text-gray-900"
            >Velocity
          </label>
          <input
            id="velocity-range"
            type="range"
            :max="max"
            :min="min"
            class="range-sm mt-5 mb-6 mr-2 h-1 w-36 cursor-pointer appearance-none rounded-lg bg-slate-200"
            v-model="ROBOT_STATE.ui_to_server.trim_kecepatan_robot[robot_order]"
          />
          <input
            type="number"
            disabled
            :max="max"
            :min="min"
            class="-mt-8 block w-16 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            v-model="ROBOT_STATE.ui_to_server.trim_kecepatan_robot[robot_order]"
          />
        </div>
        <!-- SUDUT -->
        <div class="flex items-stretch justify-items-center">
          <label
            for="sudut-range"
            class="mb-2 block w-14 text-xs font-normal text-gray-900"
            >Sudut
          </label>
          <input
            id="sudut-range"
            type="range"
            max="20"
            min="0"
            class="range-sm mt-2 mb-6 mr-2 h-1 w-36 cursor-pointer appearance-none rounded-lg bg-slate-200"
            v-model="
              ROBOT_STATE.ui_to_server.trim_kecepatan_sudut_robot[robot_order]
            "
          />
          <input
            type="number"
            max="20"
            min="0"
            disabled
            class="-px-3 -mt-6 block w-16 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            v-model="
              ROBOT_STATE.ui_to_server.trim_kecepatan_sudut_robot[robot_order]
            "
          />
        </div>
        <!-- SHOOT -->
        <div class="flex items-stretch justify-items-center">
          <label
            for="shoot-range"
            class="mb-2 block w-14 text-xs font-normal text-gray-900"
            >Shoot
          </label>
          <input
            id="shoot-range"
            type="range"
            :max="maxShoot"
            :min="minShoot"
            class="range-sm mt-2 mb-6 mr-2 h-1 w-36 cursor-pointer appearance-none rounded-lg bg-slate-200"
            v-model="ROBOT_STATE.ui_to_server.trim_penendang_robot[robot_order]"
          />
          <input
            type="number"
            :max="maxShoot"
            :min="minShoot"
            disabled
            class="block w-16 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            v-model="ROBOT_STATE.ui_to_server.trim_penendang_robot[robot_order]"
          />
        </div>
      </div>
      <!-- TABLE -->
      <div class="relative overflow-x-auto" v-if="show">
        <table
          class="w-full text-left text-sm text-gray-500 dark:text-gray-400"
        >
          <thead
            class="bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="bg-red-600 px-4 py-2 text-sm text-white">
                Var\Robot
              </th>
              <th scope="col" class="bg-red-600 px-4 py-2 text-sm text-white">
                {{ robot_order + 1 }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td class="px-4 py-2 text-left text-black">Robot Teman</td>
              <td class="px-4 py-2 text-left text-black">
                {{ ROBOT_STATE.robot[robot_order].self_data.n_robot_teman }}
              </td>
            </tr>
            <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td class="px-4 py-2 text-left text-black">Kecepatan robot</td>
              <td class="px-4 py-2 text-left text-black">
                {{ ROBOT_STATE.ui_to_server.trim_kecepatan_robot[robot_order] }}
              </td>
            </tr>
            <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td class="px-4 py-2 text-left text-black">Sudut Robot</td>
              <td class="px-4 py-2 text-left text-black">
                {{
                  ROBOT_STATE.ui_to_server.trim_kecepatan_sudut_robot[
                    robot_order
                  ]
                }}
              </td>
            </tr>
            <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td class="px-4 py-2 text-left text-black">Penendang Robot</td>
              <td class="px-4 py-2 text-left text-black">
                {{ ROBOT_STATE.ui_to_server.trim_penendang_robot[robot_order] }}
              </td>
            </tr>
            <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td class="px-4 py-2 text-left text-black">Epoch</td>
              <td class="px-4 py-2 text-left text-black">
                {{ ROBOT_STATE.robot[robot_order].pc2bs_data.epoch }}
              </td>
            </tr>
            <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td class="py-2 px-4 text-left text-black">Role</td>
              <td class="py-2 px-4 text-left text-black">
                {{ ROBOT_STATE.robot[robot_order].self_data.role }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { useField, useLogicUI, useRobot } from "../stores/store";

export default {
  props: {
    robot_order: Number,
  },
  data() {
    return {
      show: false,
      min: 0,
      max: 30,
      minShoot: 0,
      maxShoot: 10,
      slider: 40,
      baterai: [32, 33, 34, 35, 36],
    };
  },
  setup() {
    const FIELD_STATE = useField();
    const ROBOT_STATE = useRobot();
    const LOGIC_UI_STATE = useLogicUI();
    return {
      FIELD_STATE,
      LOGIC_UI_STATE,
      ROBOT_STATE,
    };
  },
  computed: {
    bateraiIndicator() {
      return {
        "bg-green-500": this.baterai == 5,
        "bg-green-500": this.baterai == 4,
        "bg-orange-500": this.baterai == 3,
        "bg-orange-500": this.baterai == 2,
        "bg-orange-600": this.baterai == 1,
      };
    },
  },
  methods: {
    getBaterai() {
      let THAT = this;
      const robot_order = THAT.robot_order;
      let ROBOT = THAT.ROBOT_STATE.robot[robot_order];
      let percent = 0;
      percent = (ROBOT.pc2bs_data.battery_health - 32.6) / (37 - 32.6);
      percent *= 100;
      ROBOT.self_data.is_active ? (percent = percent) : (percent = 0);
      if (percent <= 0) {
        percent = 0;
      } else if (percent > 100) {
        percent = 100;
      }
      return Math.floor(percent);
    },
  },
};
</script>
