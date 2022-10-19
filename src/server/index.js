const BASESTATION = require("./class/Basestation");

const UDP_MULTICAST = BASESTATION.udp_multicast;
const PORT_MULTICAST = BASESTATION.port_multicast;
const HOST = BASESTATION.host;
const GROUP = BASESTATION.group;

const UDP_UNICAST = BASESTATION.udp_unicast;
const PORT_UNICAST = BASESTATION.port_unicast;

const REFBOX = BASESTATION.refbox;
const REF_CLIENT = REFBOX.client;

const ROBOTS = BASESTATION.robot;
const {
  TIMER_SERVER_UPDATE_DATA_MS,
  TIMER_BS_TO_PC_MS,
} = require("./utils/init_data");

const WEB_SOCKET = BASESTATION.web_socket;
const EMITTER = {
  SERVER_TO_UI: "server2ui",
  UI_TO_SERVER: "ui2server",
  REFBOX: "refbox",
};

// LISTENING SOCKET

UDP_MULTICAST.on("listening", function () {
  var address = UDP_MULTICAST.address();
  console.log(
    "UDP multicast listening on " + address.address + ":" + address.port
  );
  UDP_MULTICAST.setBroadcast(true);
  UDP_MULTICAST.setMulticastTTL(64);
  UDP_MULTICAST.addMembership(GROUP, HOST);
});

UDP_UNICAST.on("listening", function () {
  const address = UDP_UNICAST.address();
  console.log(`UDP unicast listening on ${address.address}:${address.port}`);
});

// BINDING

UDP_MULTICAST.bind(PORT_MULTICAST, HOST, () => {
  console.log(`udp multicast ${HOST} connected`);
});

UDP_UNICAST.bind(PORT_UNICAST, HOST, () => {
  console.log(`udp unicast ${HOST} connected`);
});

// ON MESSAGE

UDP_MULTICAST.on("message", (message, remote) => {
  BASESTATION.readPC2BSData(message, true);
});

UDP_UNICAST.on("message", (message, remote) => {
  BASESTATION.readPC2BSData(message, false);
});

WEB_SOCKET.socket.on("connection", (status) => {
  status.on(EMITTER.UI_TO_SERVER, (item) => {
    BASESTATION.setDataFromUI(item);
  });
});

REF_CLIENT.on("data", (data) => {
  REFBOX.setMessage(data.toString());
  BASESTATION.setRefboxData();
});

// ERROR HANDLING REFEREE BOX
REF_CLIENT.on("close", function () {
  console.log("Refbox ERROR");
  REFBOX.status = false;
});

REF_CLIENT.on("error", function () {
  console.log("Refbox CLOSE");
  REFBOX.status = false;
});

// ---------- TACKLE DYNAMIC DATA ---------- //
// update data processing
// mux to every single robot
// copy global data for each robot
// send data to UI
setInterval(() => {
  BASESTATION.updateData();
}, TIMER_SERVER_UPDATE_DATA_MS);

// ---------- WRITE AND SEND DATA TO ROBOT ---------- //
setInterval(() => {
  try {
    const DATA_UI = WEB_SOCKET.data_ui;
    if (DATA_UI.is_multicast) {
      if (
        DATA_UI.status_control_robot[0] ||
        DATA_UI.status_control_robot[1] ||
        DATA_UI.status_control_robot[2] ||
        DATA_UI.status_control_robot[3] ||
        DATA_UI.status_control_robot[4]
      ) {
        const temp_data = BASESTATION.writeBS2PCData();
        UDP_MULTICAST.send(
          temp_data.buffer_data,
          0,
          temp_data.byte_counter,
          PORT_MULTICAST,
          GROUP
        );
      }
    } else {
      const len_robot = ROBOTS.length;
      for (let i = 0; i < len_robot; i++) {
        const ROBOT = ROBOTS[i];
        const ROBOT_IP = ROBOT.self_data.ip;
        if (ROBOT.is_connected && DATA_UI.status_control_robot[i]) {
          // if (DATA_UI.status_control_robot[i]) {
          const temp_data = BASESTATION.writeBS2PCData();
          UDP_UNICAST.send(temp_data.buffer_data, PORT_UNICAST, ROBOT_IP);
        }
      }
    }
  } catch (e) {
    console.log("error write ", e);
  }
}, TIMER_BS_TO_PC_MS);
