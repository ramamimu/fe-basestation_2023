<template>
  <div class="col-span-12 mx-16 mt-5 flex flex-col flex-wrap">
    <div class="flex flex-row items-center justify-center gap-x-10">
      <router-link
        class="flex cursor-pointer select-none flex-row space-x-2 text-center"
        to="/regional"
      >
        <svg
          fill="none"
          stroke="red"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          class="h-6 w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          ></path>
        </svg>
        <div>Back</div>
      </router-link>
      <div>
        <div
          class="inline-flex cursor-pointer items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          @click="sort = !sort"
        >
          {{ sorted_by.toUpperCase() }}
          <svg
            class="ml-2 h-4 w-4"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
        <!-- Dropdown menu -->
        <div
          class="absolute z-10 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700"
          :class="{ hidden: !sort }"
        >
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <a
                @click="
                  sort = !sort;
                  sorted_by = 'date';
                  getHistory();
                "
                href="#"
                class="block px-7 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >DATE</a
              >
            </li>
            <li>
              <a
                @click="
                  sort = !sort;
                  sorted_by = 'goal';
                  getHistory();
                "
                href="#"
                class="block px-7 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >GOAL</a
              >
            </li>
            <li>
              <a
                @click="
                  sort = !sort;
                  sorted_by = 'play';
                  getHistory();
                "
                href="#"
                class="block px-7 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >PLAY</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="flex w-full flex-row flex-wrap items-center justify-around">
      <template v-for="(history, index) in histories" :key="index">
        <div
          class="card flex w-1/5 flex-row flex-wrap space-y-1 overflow-x-auto overflow-y-hidden md:flex-col"
        >
          <div class="mx-3 flex flex-row flex-wrap justify-between">
            <div
              class="inline-block select-none rounded-lg bg-green-500 py-1 px-3 font-bold text-white"
            >
              goal : {{ history.total_goal }}
            </div>
            <div
              class="inline-block select-none rounded-lg bg-blue-500 py-1 px-3 font-bold text-white"
            >
              play : {{ history.total_play }}
            </div>
            <div
              class="inline-block cursor-pointer select-none text-center font-bold"
              @click="deleteHistory(index)"
            >
              <svg
                fill="none"
                stroke="red"
                stroke-width="1.5"
                class="h-7 w-7"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                ></path>
              </svg>
            </div>
          </div>
          <div
            class="inline-block select-none rounded-lg py-1 px-3 text-center font-bold"
          >
            {{ new Date(history.date).toLocaleString() }}
          </div>
          <div class="flex flex-col">
            <div
              v-for="(lap, index) in history.laps"
              :key="index"
              class="flex flex-row justify-around"
            >
              <div>{{ lap.timeFromZero }}</div>
              <div>{{ lap.timeFromBefore }}</div>
            </div>
            <hr class="my-2" />
            <div
              v-for="(lap, index) in history.time_abc"
              :key="index"
              class="flex flex-row justify-around"
            >
              <div>{{ lap.cyc_id }}</div>
              <div>{{ lap.timeFromZero }}</div>
              <div>{{ lap.timeFromBefore }}</div>
            </div>
            <hr class="my-2" />
            <div v-if="history.obs" class="flex flex-row justify-around">
              <div v-for="(obs, index) in history.obs.obs_robot" :key="index">
                <div>{{ obs }}</div>
              </div>
              <div>kiper: {{ history.obs.obs_kiper }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "History",
  data() {
    return {
      histories: [],
      sort: false,
      sorted_by: "date",
    };
  },
  methods: {
    getHistory() {
      if (localStorage.getItem("history_timer") != null) {
        this.histories = JSON.parse(localStorage.getItem("history_timer"));
        this.sortHistory();
      }
    },
    deleteHistory(index) {
      this.histories.splice(index, 1);
      localStorage.setItem("history_timer", JSON.stringify(this.histories));
    },
    sortHistory() {
      if (this.sorted_by == "date") {
        this.histories.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
      } else if (this.sorted_by == "goal") {
        this.histories.sort((a, b) => {
          return b.total_goal - a.total_goal;
        });
      } else if (this.sorted_by == "play") {
        this.histories.sort((a, b) => {
          return b.total_play - a.total_play;
        });
      }
    },
  },
  mounted() {
    this.getHistory();
  },
};
</script>
