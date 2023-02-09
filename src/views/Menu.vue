<template>
  <div class="absolute z-50 border">
    <div
      class="z-50 overflow-y-auto overflow-x-hidden md:inset-0"
      :class="LOGIC_UI_STATE.ip_settings ? '' : 'hidden'"
    ></div>
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
              for="is-multicast"
              class="relative inline-flex cursor-pointer items-center"
            >
              <input
                type="checkbox"
                v-model="ROBOT_STATE.ui_to_server.is_multicast"
                id="is-multicast"
                class="peer sr-only"
              />
              <div class="toggle peer"></div>
              <span
                class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                >multicast</span
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
