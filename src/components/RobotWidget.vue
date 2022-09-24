<template>
  <div
    class="w-fit max-w-sm rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800"
  >
    <div class="relative overflow-x-auto">
      <div class="grid grid-cols-3 grid-rows-2">
        <div
          class="py-1 pl-3 align-middle"
          :class="{
            'bg-red-600 font-normal text-white':
              !ROBOT_STATE.robot[robot_order].self_data.is_active,
            'bg-white font-bold text-green-500':
              ROBOT_STATE.robot[robot_order].self_data.is_active,
          }"
        >
          Robot {{ robot_order + 1 }}
        </div>
        <div
          class="col-span-2 row-span-2 flex h-full items-center justify-center"
        >
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white py-2.5 px-5 text-lg font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200"
          >
            Control Box
          </button>
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
            class="range-sm mb-6 mr-2 mt-5 h-1 w-36 cursor-pointer appearance-none rounded-lg bg-slate-200"
            v-model="ROBOT_STATE.ui_to_server.trim_kecepatan_robot[robot_order]"
          />
          <input
            type="number"
            :max="max"
            :min="min"
            class="block w-16 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
            class="range-sm mb-6 mr-2 h-1 w-36 cursor-pointer appearance-none rounded-lg bg-gray-200"
            v-model="
              ROBOT_STATE.ui_to_server.trim_kecepatan_sudut_robot[robot_order]
            "
          />
          <input
            type="number"
            max="20"
            min="0"
            class="block w-16 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
            class="range-sm mb-6 mr-2 h-1 w-36 cursor-pointer appearance-none rounded-lg bg-gray-200"
            v-model="ROBOT_STATE.ui_to_server.trim_penendang_robot[robot_order]"
          />
          <input
            type="number"
            :max="maxShoot"
            :min="minShoot"
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
              <th scope="col" class="bg-red-600 py-2 px-4 text-sm text-white">
                Var\Robot
              </th>
              <th scope="col" class="bg-red-600 py-2 px-4 text-sm text-white">
                {{ robot_order + 1 }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td class="py-2 px-4 text-left text-black">Robot Teman</td>
              <td class="py-2 px-4 text-left text-black">
                {{ ROBOT_STATE.robot[robot_order].self_data.n_robot_teman }}
              </td>
            </tr>
            <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td class="py-2 px-4 text-left text-black">Kecepatan robot</td>
              <td class="py-2 px-4 text-left text-black">
                {{ ROBOT_STATE.ui_to_server.trim_kecepatan_robot[robot_order] }}
              </td>
            </tr>
            <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td class="py-2 px-4 text-left text-black">Sudut Robot</td>
              <td class="py-2 px-4 text-left text-black">
                {{
                  ROBOT_STATE.ui_to_server.trim_kecepatan_sudut_robot[
                    robot_order
                  ]
                }}
              </td>
            </tr>
            <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td class="py-2 px-4 text-left text-black">Penendang Robot</td>
              <td class="py-2 px-4 text-left text-black">
                {{ ROBOT_STATE.ui_to_server.trim_penendang_robot[robot_order] }}
              </td>
            </tr>
            <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              <td class="py-2 px-4 text-left text-black">Epoch</td>
              <td class="py-2 px-4 text-left text-black">
                {{ ROBOT_STATE.robot[robot_order].pc2bs_data.epoch }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { useRobot } from "../stores/store";

export default {
  setup() {
    const ROBOT_STATE = useRobot();
    return {
      ROBOT_STATE,
    };
  },
  props: {
    robot_order: Number,
  },
  data() {
    return {
      show: false,
      min: 0,
      max: 50,
      minShoot: 0,
      maxShoot: 10,
      slider: 40,
    };
  },
};
</script>
