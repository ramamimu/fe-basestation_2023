<!-- eslint-disable vue/multi-word-component-names -->
<script>
import { useToast } from "../stores/toast";

export default {
  setup() {
    const TOAST_STATE = useToast();
    return {
      TOAST_STATE,
    };
  },
};
</script>

<template>
  <div
    class="card absolute right-5 z-50 flex overflow-hidden p-4 shadow-lg shadow-red-600"
  >
    <div class="flex gap-2">
      <svg
        v-if="!TOAST_STATE.toast.isSuccess"
        aria-hidden="true"
        class="h-5 w-5"
        style="width: 20px"
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
      <svg
        style="width: 20px"
        aria-hidden="true"
        class="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        v-else
      >
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        ></path>
      </svg>
      {{ TOAST_STATE.toast.message }}
    </div>
  </div>
</template>
