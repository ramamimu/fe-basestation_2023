<template>
  <div
    :class="[
      data
        ? 'bg-green-500 p-2 hover:bg-green-600'
        : 'bg-red-600 p-2 hover:bg-red-700',
      'inline-block cursor-pointer select-none font-bold text-white',
    ]"
    @click="data = !data"
  >
    {{ title }}
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
