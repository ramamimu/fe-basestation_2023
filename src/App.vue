<template>
  <div bottom style="background-color: rgb(206, 206, 206)">
    <v-tooltip>
      <template v-slot:activator="{ attrs }">
        <v-img
          alt="Vuetify Logo"
          src="../src/assets/header.png"
          transition="scale-transition"
          width="100%"
          max-height="104"
          style="cursor: pointer"
          v-bind="attrs"
          contain
        />
        <!-- v-on="on" -->
        <!-- @click.stop="toggle()" -->
      </template>
      <span>CLICK TO OPEN MENU</span>
    </v-tooltip>
    <!-- v-model="$store.state.system.global.drawer" -->
    <!-- <v-app>
      <v-navigation-drawer absolute temporary>
        <Menu />
      </v-navigation-drawer>
      <v-main>
        <v-container fluid>
          <router-view />
        </v-container>
      </v-main>
    </v-app> -->
  </div>
  <h1>UI</h1>
  <p>{{ ui }}</p>
  <!-- {{ robots }} -->
  <h1>robot 1</h1>
  <p>{{ robot[0] }}</p>
  <h1>robot 2</h1>
  <p>{{ robot[1] }}</p>
  <h1>robot 3</h1>
  <p>{{ robot[2] }}</p>
  <h1>robot 4</h1>
  <p>{{ robot[3] }}</p>
  <h1>robot 5</h1>
  <p>{{ robot[4] }}</p>
</template>

<script>
import { useRobotData, useUIToServerData } from "@/stores/store.js";

export default {
  setup() {
    const { robot } = useRobotData();
    const { ui } = useUIToServerData();
    return {
      robot,
      ui,
    };
  },
  mounted() {
    console.log(this.robot);
  },
};
</script>
