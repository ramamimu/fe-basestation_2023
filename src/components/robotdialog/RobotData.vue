<template>
  <tr class="hover:bg-slate-100">
    <td style="font-size: 12px" class="px-4 text-left">
      {{ title }}
    </td>
    <slot></slot>
  </tr>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
