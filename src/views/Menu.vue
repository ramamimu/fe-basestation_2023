<template>
  <div class="absolute z-50 border">
    <div
      class="fixed z-50 h-modal w-full overflow-y-auto overflow-x-hidden p-4 md:inset-0 md:h-full"
      :class="LOGIC_UI_STATE.ip_settings ? '' : 'hidden'"
    >
      <div class="relative top-1/4 mx-auto h-full w-full max-w-2xl md:h-auto">
        <!-- Modal content -->
        <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div
            class="flex items-start justify-between rounded-t border-b px-4 pt-4 pb-2 dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Settings
            </h3>
            <button
              @click="
                (LOGIC_UI_STATE.ip_settings = false),
                  LOGIC_UI_STATE.toggleMenu()
              "
              type="button"
              class="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                aria-hidden="true"
                class="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="space-y-4 px-6 pt-3 pb-6">
            <div class="w-full text-center">IP REFBOX</div>
            <div class="flex w-full flex-row items-center justify-center">
              <label
                for="default-input"
                class="mb-2 block w-1/5 text-sm font-medium text-gray-900 dark:text-white"
                >IP REFBOX</label
              >
              <input
                type="text"
                id="default-input"
                class="block w-4/5 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                v-model="LOGIC_UI_STATE.ip_refbox"
              />
            </div>
            <div class="w-full text-center">IP ROBOT</div>
            <div
              class="flex w-full flex-row items-center justify-center"
              v-for="(robot, index) in ROBOT_STATE.robot"
              :key="index"
            >
              <label
                for="default-input2"
                class="mb-2 block w-1/5 text-sm font-medium text-gray-900 dark:text-white"
                >IP ROBOT {{ index + 1 }}</label
              >
              <input
                type="text"
                id="default-input2"
                class="block w-4/5 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                v-model="robot.ip"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="z-40 grid h-[1000px] w-screen grid-cols-12 grid-rows-6"
      v-if="LOGIC_UI_STATE.toggle_menu"
    >
      <div
        class="col-span-2 row-span-full h-[1000px] place-content-start bg-white pt-2"
      >
        <div class="mb-2 flex pl-3 text-2xl">
          <img src="../assets/iris-icon.png" class="mr-3 h-10" alt="" />
          IRIS Basestation
        </div>
        <div class="flex flex-col">
          <router-link to="/regional">
            <div
              class="cursor-pointer py-2 pl-6 hover:bg-slate-200"
              :class="{
                'bg-slate-300':
                  $router.currentRoute._value.fullPath == `/regional`,
              }"
            >
              Regional
            </div>
          </router-link>
          <router-link to="/">
            <div
              class="cursor-pointer py-2 pl-6 hover:bg-slate-200"
              :class="{
                'bg-slate-300': $router.currentRoute._value.fullPath == `/`,
              }"
            >
              Nasional
            </div>
          </router-link>
          <div class="cursor-pointer py-2 pl-6 hover:bg-slate-200">Robocup</div>
        </div>
        <div class="pl-3">
          <button
            @click="LOGIC_UI_STATE.ip_settings = true"
            type="button"
            class="my-3 rounded-lg border border-gray-200 bg-blue-600 py-2.5 px-14 text-lg font-medium text-white hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 md:px-8 lg:px-14"
          >
            Status Control Robot
          </button>
        </div>
        <!-- for toogle -->
        <div class="mt-1 pl-3">
          <div>
            <label for="is-multicast" class="relative inline-flex items-center">
              <input
                type="checkbox"
                v-model="LOGIC_UI_STATE.is_multicast"
                id="is-multicast"
                class="peer sr-only"
                disabled
              />
              <div class="toggle peer"></div>
              <span class="ml-3 text-sm font-medium text-gray-300"
                >multicast</span
              >
            </label>
          </div>
          <div>
            <label
              for="rotate-field"
              class="relative inline-flex cursor-pointer items-center"
            >
              <input
                type="checkbox"
                v-model="LOGIC_UI_STATE.rotate_field"
                id="rotate-field"
                class="peer sr-only"
              />
              <div class="toggle peer"></div>
              <span
                class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Rotate Field</span
              >
            </label>
          </div>
          <div>
            <label
              for="manual-show"
              class="relative inline-flex cursor-pointer items-center"
            >
              <input
                type="checkbox"
                v-model="LOGIC_UI_STATE.is_show_before_linked"
                id="manual-show"
                class="peer sr-only"
              />
              <div class="toggle peer"></div>
              <span
                class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                >manual show</span
              >
            </label>
          </div>
        </div>
      </div>
      <div
        class="col-span-10 row-span-full bg-black opacity-30"
        @click="LOGIC_UI_STATE.toggleMenu()"
      >
        <div class="fixed bg-slate-900">p</div>
      </div>
    </div>
  </div>
</template>

<script>
import { useLogicUI, useSocketIO, useRobot } from "../stores/store";

export default {
  data() {
    return {
      test: true,
      items: [
        { title: "Nasional", icon: "mdi-view-dashboard" },
        { title: "Regional", icon: "mdi-forum" },
        { title: "Robocup", icon: "mdi-earth" },
      ],
      menu: false,
      ipRobot: false,
      message: false,
      hints: true,
    };
  },
  setup() {
    const LOGIC_UI_STATE = useLogicUI();
    const ROBOT_STATE = useRobot();
    return {
      LOGIC_UI_STATE,
      ROBOT_STATE,
    };
  },
};
</script>
