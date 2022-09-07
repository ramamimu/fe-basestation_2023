<template>
  <div>
    <v-row>
      <v-col xs="12" sm="12" md="3" class="align-self-center">
        <RobotDialog />
      </v-col>
      <v-col
        xs="12"
        sm="12"
        md="6"
        class="align-self-center"
        id="container-stage"
      >
        <field />
      </v-col>
      <v-col xs="12" sm="12" md="3" class="align-self-center">
        <CommandWidget />
      </v-col>
    </v-row>
    <v-row>ini row ke 2</v-row>
  </div>
</template>

<script>
import RobotDialog from "../components/RobotDialog.vue";
import Field from "../components/Field.vue";
import CommandWidget from "../components/CommandWidget.vue";

export default {
  components: {
    RobotDialog,
    Field,
    CommandWidget,
  },
  data() {
    return {};
  },
};
</script>
