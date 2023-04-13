<template>
  <div>
    <div class="card overflow-auto">
      <div>
        <h5>
          n Aktif | ready :
          <span class="">
            {{ ROBOT_STATE.global_data_server.n_robot_aktif }}
          </span>
          |
          <span class="">
            {{ ROBOT_STATE.global_data_server.n_robot_ready }}
          </span>
        </h5>
        <h5>
          n dekat | dapat bola:
          <span class="">
            {{ ROBOT_STATE.global_data_server.n_robot_dekat_bola }}
          </span>
          ||
          <span class="">
            {{ ROBOT_STATE.global_data_server.n_robot_dapat_bola }}
          </span>
        </h5>
        <h5>
          n umpan | terima:
          <span class="">
            {{ ROBOT_STATE.global_data_server.n_robot_umpan }}
          </span>
          ||
          <span class="">
            {{ ROBOT_STATE.global_data_server.n_robot_terima }}
          </span>
        </h5>
        <h5>
          counter passing:
          <span class="">
            {{ ROBOT_STATE.global_data_server.pass_counter }}
          </span>
        </h5>

        <h5>
          bola global:
          <span class="">
            {{ ROBOT_STATE.global_data_server.bola_x_pada_lapangan }}
            <span class="black--text">|| </span>
          </span>
          <span class="blue--text">
            {{ ROBOT_STATE.global_data_server.bola_y_pada_lapangan }}
          </span>
        </h5>
      </div>
      <div>
        <h5>
          (1)GoalKeeper :
          <span class=""> 1 </span>
        </h5>
        <h5>
          (2)Attacker :
          <span class="">
            {{ getRoleRobot(1) }}
          </span>
        </h5>
        <h5>
          (3)assist :
          <span class="">
            {{ getRoleRobot(3) }}
          </span>
        </h5>
        <h5>
          (4)Defender :
          <span class="">
            {{ getRoleRobot(2) }}
          </span>
        </h5>
        <h5 class="">
          (5)Defender:
          <span>
            {{ getRoleRobot(4) }}
          </span>
        </h5>
      </div>
    </div>
    <div class="card flex overflow-auto">
      <table class="mx-auto w-full rounded-lg bg-white p-0 shadow-md">
        <tr>
          <th
            class="cursor-pointer py-2 text-left text-sm text-slate-600"
            @click.stop="UI_LOGIC_STATE.toggleMenu()"
          >
            Var\Robot
          </th>

          <NumRobot
            v-for="(robot, index) in robots"
            :key="index"
            :no_hover="robot.colors.no_hover"
            :with_hover="robot.colors.with_hover"
            :num_robot="index + 1"
          />
        </tr>
        <tbody>
          <RobotData title="Epoch">
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.epoch % 10000 }}
            </td>
          </RobotData>
          <RobotData title="Role">
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.self_data.role }}
            </td>
          </RobotData>
          <RobotData title="Condition">
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.robot_condition }}
            </td>
          </RobotData>
          <RobotData title="Odometry">
            <td
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
              style="font-size: 12px"
            >
              {{ item.pc2bs_data.pos_x }} <br />
              {{ item.pc2bs_data.pos_y }} <br />
              {{ item.pc2bs_data.theta }}
            </td>
          </RobotData>

          <RobotData title="Status Bola">
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.status_bola }}
            </td>
          </RobotData>
          <RobotData title="Posisi Bola">
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.bola_x }} <br />
              {{ item.pc2bs_data.bola_y }}
            </td>
          </RobotData>

          <RobotData title="n robot teman">
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.self_data.n_robot_teman }}
            </td>
          </RobotData>
          <RobotData title="Baterai">
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.battery_health.toFixed(2) }}
            </td>
          </RobotData>

          <RobotData title="Index Point">
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.index_point }}
            </td>
          </RobotData>

          <RobotData title="Passing Target">
            <td
              style="font-size: 12px"
              v-for="(item, index) in ROBOT_STATE.robot"
              :key="index"
            >
              {{ item.pc2bs_data.pass_target_x }} <br />
              {{ item.pc2bs_data.pass_target_y }}
            </td>
          </RobotData>

          <tr>
            <td
              style="font-size: 15px"
              class="bg-yellow-800 px-4 text-left font-bold text-white"
            >
              STYLE
            </td>

            <Style
              v-for="(robot, index) in robots"
              :key="index"
              :no_hover="robot.colors.no_hover"
              :with_hover="robot.colors.with_hover"
              :num_style="robot.style"
            />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { useRobot, useLogicUI } from "../stores/store";
import NumRobot from "./robotdialog/NumRobot.vue";
import Style from "./robotdialog/Style.vue";
import RobotData from "./robotdialog/RobotData.vue";

export default {
  setup() {
    const UI_LOGIC_STATE = useLogicUI();
    const ROBOT_STATE = useRobot();
    return {
      UI_LOGIC_STATE,
      ROBOT_STATE,
    };
  },
  data() {
    return {
      robots: [
        {
          colors: {
            no_hover: "bg-green-400",
            with_hover: "bg-green-500",
          },
          style: 65,
        },
        {
          colors: {
            no_hover: "bg-blue-500",
            with_hover: "bg-blue-600",
          },
          style: 66,
        },
        {
          colors: {
            no_hover: "bg-pink-500",
            with_hover: "bg-pink-600",
          },
          style: 67,
        },
        {
          colors: {
            no_hover: "bg-red-500",
            with_hover: "bg-red-600",
          },
          style: 68,
        },
        {
          colors: {
            no_hover: "bg-yellow-300",
            with_hover: "bg-yellow-400",
          },
          style: 69,
        },
      ],
    };
  },
  components: {
    NumRobot,
    Style,
    RobotData,
  },
  methods: {
    getRoleRobot(n_role) {
      // Goal Keeper -> 0
      // attacker -> 1
      // assist -> 3
      // defender1 -> 2
      // defender2 -> 4
      const LEN_ROBOT = this.ROBOT_STATE.robot.length;
      let n_robot_roles = 0;

      for (let i = 0; i < LEN_ROBOT; i++) {
        if (n_role == this.ROBOT_STATE.robot[i].self_data.role)
          n_robot_roles = i + 1;
      }
      return n_robot_roles;
    },
  },
};
</script>
