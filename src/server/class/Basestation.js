const Robot = require("./Robot.js");
const {
  GLOBAL_DATA_SERVER,
  PC2BS_DATA_ROBOT,
  BS2PC_DATA_ROBOT,
} = require("../utils/init_data");

const Config = require("../../config/setup.json");

const EMITTER = {
  SERVER_TO_UI: "server2ui",
  UI_TO_SERVER: "ui2server",
  REFBOX: "refbox",
};

class Basestation {
  web_socket = require("./WebSocket");

  refbox = require("./Refbox");

  setRefboxStatus(status) {
    const THAT = this;
    const GLOBAL_DATA_UI = THAT.web_socket.data_ui;
    const REFBOX = THAT.refbox;
    if (status != GLOBAL_DATA_UI.connect_refbox) {
      if (status) {
        REFBOX.connect();
      } else {
        REFBOX.disconnect();
      }

      let msg_refbox = THAT.getMessageRefbox(REFBOX.status, "STOP", "ALL");
      THAT.web_socket.emitData(EMITTER.REFBOX, msg_refbox);
    }
  }

  setDataFromUI(item) {
    const THAT = this;
    const WEB_SOCKET = THAT.web_socket;
    THAT.setRefboxStatus(item.connect_refbox);
    WEB_SOCKET.setDataFromUI(item);
  }

  setRefboxData() {
    const THAT = this;
    const REFBOX = THAT.refbox;
    let msg_refbox;
    if (Config.is_2019) {
      let { string_command, target_team } = THAT.setMessageRefbox(
        REFBOX.message
      );
      msg_refbox = THAT.getMessageRefbox(
        REFBOX.status,
        string_command,
        target_team
      );
    } else {
      msg_refbox = THAT.getMessageRefbox(
        REFBOX.status,
        REFBOX.message.command,
        REFBOX.message.targetTeam
      );
    }
    THAT.web_socket.emitData(EMITTER.REFBOX, msg_refbox);
  }

  setMessageRefbox(command) {
    let string_command;
    let target_team;
    let play = ["W", "s", "S", "N", "L", "#", "a"];

    if (play.includes(command)) {
      target_team = "ALL";
    } else if (command.toUpperCase() == command) {
      target_team = "HOME";
    } else {
      target_team = "AWAY";
    }

    if (command == "s") {
      string_command = "START";
    } else if (command == "S") {
      string_command = "STOP";
    } else if (command == "N") {
      string_command = "DROP_BALL";
    } else if (command == "L") {
      string_command = "PARK";
    } else if (command == "#") {
      string_command = "KALIBRASI";
    } else if (command == "a") {
      string_command = "GOAL";
    } else if (command == "W") {
      string_command = "WELCOME";
    } else {
      if (command == "K" || command == "k") {
        string_command = "KICKOFF";
      } else if (command == "F" || command == "f") {
        string_command = "FREEKICK";
      } else if (command == "G" || command == "g") {
        string_command = "GOALKICK";
      } else if (command == "T" || command == "t") {
        string_command = "THROWIN";
      } else if (command == "C" || command == "c") {
        string_command = "CORNER";
      } else if (command == "P" || command == "p") {
        string_command = "PENALTY";
      }
    }

    return { string_command, target_team };
  }

  getMessageRefbox(status, command, target_team) {
    return {
      status: status,
      message: {
        command: command,
        targetTeam: target_team,
      },
    };
  }
}

module.exports = new Basestation();
