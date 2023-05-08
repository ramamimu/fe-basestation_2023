<template>
  <div class="card flex flex-row flex-wrap justify-center overflow-hidden">
    <!-- home -->
    <div class="flex flex-col">
      <CommandButton
        v-for="(command, index) in commands"
        :key="index"
        :message="command.message"
        :command="command.home"
      />
    </div>
    <!-- all -->
    <div class="flex flex-col">
      <CommandButton
        v-for="(command, index) in commands_play"
        :key="index"
        :message="command.message"
        :command="command.rule"
      />
    </div>
    <!-- away -->
    <div class="flex flex-col">
      <CommandButton
        v-for="(command, index) in commands"
        :key="index"
        :message="command.message"
        :command="command.away"
      />
    </div>
  </div>
</template>

<script>
import CommandButton from "./CommandButton.vue";

export default {
  data() {
    return {
      commands: [
        {
          message: "Kick Off",
          home: "K",
          away: "k",
        },
        {
          message: "Free Kick",
          home: "F",
          away: "f",
        },
        {
          message: "Goal Kick",
          home: "G",
          away: "g",
        },
        {
          message: "Corner Kick",
          home: "C",
          away: "c",
        },
        {
          message: "Penalty",
          home: "P",
          away: "p",
        },
        {
          message: "Throw In",
          home: "T",
          away: "t",
        },
      ],
      commands_play: [
        {
          message: "Start",
          rule: "s",
        },
        {
          message: "Stop",
          rule: "S",
        },
        {
          message: "Drop Ball",
          rule: "N",
        },
        {
          message: "Park",
          rule: "L",
        },
        {
          message: "Kalibrasi",
          rule: "#",
        },
      ],
    };
  },
  components: {
    CommandButton,
  },
};
</script>
