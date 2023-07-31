import { defineStore } from "pinia";
import { useRobot, useLogicUI } from "./store";
import "roslib/build/roslib";

export const useRos = defineStore({
  id: "ros",
  state: () => ({
    ros: null,
    ui2server_topic: null,
    rob_topic: [null, null, null, null, null],
    cllction_topic: null,
    entity_robot: null,
    auto_cmd: null,
    list_topic: {
      PC2BS_ROBOT: "/pc2bs",
      ENTITY_ROBOT: "/entity_robot",
      COLLECTION: "/collection",
      UI2SERVER: "/ui2server",
      AUTO_CMD: "/auto_cmd",
    },
    list_message: {
      PC2BS: "communications/PC2BS",
      ENTITY_ROBOT: "basestation/EntityRobot",
      COLLECTION: "basestation/Collection",
      UI2SERVER: "basestation/FE2BE",
      AUTO_CMD: "basestation/AutoCmd",
    },
  }),
  actions: {
    async initRos() {
      const THAT = this;
      const ROBOT_STATE = useRobot();
      THAT.ros = await new ROSLIB.Ros({
        url: "ws://localhost:9090",
      });
      THAT.ros.on("connection", () => {
        console.log("Connected to websocket server.");
        useLogicUI().is_connected_backend = true;
      });
      THAT.ros.on("error", (error) => {
        useLogicUI().is_connected_backend = false;
        console.log("Error connecting to websocket server");
      });
      THAT.ros.on("close", () => {
        useLogicUI().is_connected_backend = false;
        console.log("Connection to websocket server closed. reconnecting...");
        THAT.ros.connect("ws://localhost:9090");
      });

      // PC2BS
      for (let i = 0; i < 5; i++) {
        let topic = `${THAT.list_topic.PC2BS_ROBOT}_r${i + 1}`;
        THAT.rob_topic[i] = new ROSLIB.Topic({
          ros: THAT.ros,
          name: topic,
          messageType: THAT.list_message.PC2BS,
        });

        THAT.rob_topic[i].subscribe((message) => {
          ROBOT_STATE.robot[i].pc2bs_data = message;
        });
      }

      // ENTITY_ROBOT
      THAT.entity_robot = new ROSLIB.Topic({
        ros: THAT.ros,
        name: THAT.list_topic.ENTITY_ROBOT,
        messageType: THAT.list_message.ENTITY_ROBOT,
      });

      // COLLECTION
      THAT.cllction_topic = new ROSLIB.Topic({
        ros: THAT.ros,
        name: THAT.list_topic.COLLECTION,
        messageType: THAT.list_message.COLLECTION,
      });

      // UI2SERVER
      THAT.ui2server_topic = new ROSLIB.Topic({
        ros: THAT.ros,
        name: THAT.list_topic.UI2SERVER,
        messageType: THAT.list_message.UI2SERVER,
      });

      // AUTO_CMD
      THAT.auto_cmd = new ROSLIB.Topic({
        ros: THAT.ros,
        name: THAT.list_topic.AUTO_CMD,
        messageType: THAT.list_message.AUTO_CMD,
      });

      THAT.entity_robot.subscribe((message) => {
        for (let i = 0; i < 5; i++) {
          ROBOT_STATE.robot[i].self_data.is_active = message.is_active[i];
          ROBOT_STATE.robot[i].self_data.n_robot_teman =
            message.n_robot_teman[i];
          ROBOT_STATE.robot[i].self_data.role = message.role[i];
          ROBOT_STATE.robot[i].self_data.bs_time_ = message.time_coming[i];

          const obs_msg_x = `obs_x_r${i + 1}`;
          const obs_msg_y = `obs_y_r${i + 1}`;
          const group_obs_msg_x = `group_${obs_msg_x}`;
          const group_obs_msg_y = `group_${obs_msg_y}`;

          ROBOT_STATE.robot[i].self_data.obs_x = message[obs_msg_x];
          ROBOT_STATE.robot[i].self_data.obs_y = message[obs_msg_y];
          ROBOT_STATE.robot[i].self_data.group_obs_x = [
            ...message[group_obs_msg_x],
          ];
          ROBOT_STATE.robot[i].self_data.group_obs_y = [
            ...message[group_obs_msg_y],
          ];
        }
      });

      THAT.cllction_topic.subscribe((message) => {
        ROBOT_STATE.global_data_server = message;
      });

      setInterval(() => {
        const msg = new ROSLIB.Message(ROBOT_STATE.ui_to_server);
        THAT.ui2server_topic.publish(msg);
      }, 10);
    },
  },
});
