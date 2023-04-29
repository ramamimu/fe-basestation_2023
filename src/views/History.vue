<template>
  <div class="col-span-12 mx-16 mt-5 flex flex-col flex-wrap items-center">
    <div
      class="inline-block cursor-pointer select-none bg-red-600 p-2 font-bold text-white hover:bg-red-700"
      @click="$router.push('/regional')"
    >
      Back to Regional Field
    </div>
    <div class="flex w-full flex-row flex-wrap items-center justify-around">
      <template v-for="(history, index) in histories" :key="index">
        <div
          class="card flex w-1/5 flex-col flex-wrap space-y-1 overflow-hidden"
        >
          <div class="mx-3 flex flex-row flex-wrap justify-between">
            <div
              class="inline-block select-none rounded-lg bg-blue-500 py-1 px-3 font-bold text-white"
            >
              goal : {{ history.total_goal }}
            </div>
            <div
              class="inline-block cursor-pointer select-none rounded-lg text-center font-bold"
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
    };
  },
  methods: {
    getHistory() {
      this.histories = JSON.parse(localStorage.getItem("history_timer"));
      this.histories.reverse();
      console.log(this.histories);
    },
    deleteHistory(index) {
      this.histories.splice(index, 1);
      localStorage.setItem("history_timer", JSON.stringify(this.histories));
    },
  },
  mounted() {
    this.getHistory();
  },
};
</script>
