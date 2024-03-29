import { ref } from "vue";
import { defineStore } from "pinia";

export const useToast = defineStore("toast", () => {
  const toast = ref({
    status: false,
    message: "",
    isSuccess: false,
  });

  function showToast(message, isSuccess, timeInMs) {
    toast.value.status = true;
    toast.value.message = message;
    toast.value.isSuccess = isSuccess;
    setTimeout(() => {
      if (message == toast.value.message) hideToast();
    }, timeInMs);
  }

  function hideToast() {
    toast.value.status = false;
  }

  return { toast, showToast, hideToast };
});
