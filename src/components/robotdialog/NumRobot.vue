<template>
  <th
    class="cursor-pointer text-sm text-white"
    :class="[`${no_hover} hover:${with_hover}`]"
  >
    {{ num_robot }}
  </th>
</template>

<script>
export default {
  props: {
    num_robot: {
      type: Number,
      default: 0,
    },
    no_hover: {
      type: String,
      required: true,
    },
    with_hover: {
      type: String,
      required: true,
    },
  },
};
</script>
