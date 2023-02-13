const BASESTATION = require("./class/Basestation");
const CONFIG = require("../config/setup.json");

const UDP_MULTICAST = BASESTATION.udp_multicast;
const PORT_MULTICAST = BASESTATION.port_multicast;
const HOST = BASESTATION.host;
const GROUP = BASESTATION.group;

const UDP_UNICAST = BASESTATION.udp_unicast;
const PORT_UNICAST = BASESTATION.port_unicast;

const REFBOX = BASESTATION.refbox;
const REF_CLIENT = REFBOX.client;

const ROBOTS = BASESTATION.robot;
const { TIMER_BS_TO_PC_MS } = require("./utils/init_data");

const WEB_SOCKET = BASESTATION.web_socket;
const EMITTER = {
  SERVER_TO_UI: "server2ui",
  UI_TO_SERVER: "ui2server",
  REFBOX: "refbox",
};

// LISTENING SOCKET

UDP_MULTICAST.on("listening", function () {
  var address = UDP_MULTICAST.address();
  console.log("UDP multicast listening on " + address.address + ":" + address.port);
  UDP_MULTICAST.setBroadcast(false);
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
WEB_SOCKET.socket.on("connection", (status) => {
  status.on(EMITTER.UI_TO_SERVER, (item) => {
    console.log("tess");
    BASESTATION.setDataFromUI(item);
  });
});

UDP_MULTICAST.on("message", (message, remote) => {
  BASESTATION.readPC2BSData(message, true);
});

UDP_UNICAST.on("message", (message, remote) => {
  BASESTATION.readPC2BSData(message, false);
});

REF_CLIENT.on("data", (data) => {
  REFBOX.setMessage(data.toString());
  BASESTATION.setRefboxData();
});

// ERROR HANDLING REFEREE BOX
REF_CLIENT.on("close", function () {
  REFBOX.status = false;
  BASESTATION.setRefboxData();
  console.log("Refbox CLOSE");
});

REF_CLIENT.on("error", function () {
  REFBOX.status = false;
  BASESTATION.setRefboxData();
  console.log("Refbox ERROR");
});

// SEND ACK TO EACH ROBOT
setInterval(() => {
  if (!CONFIG.is_multicast) {
    const len_robot = ROBOTS.length;
    for (let i = 0; i < len_robot; i++) {
      if (!ROBOTS[i].is_connected) UDP_UNICAST.send("ack", PORT_UNICAST, ROBOTS[i].self_data.ip);
    }
  }
}, 1000);

// ---------- WRITE AND SEND DATA TO ROBOT ---------- //
setInterval(() => {
  try {
    /*  update data processing
        mux to every single robot
        copy global data for each robot
        send data to UI 
    */
    BASESTATION.updateData();
    const GLOBAL_DATA_UI = WEB_SOCKET.data_ui;
    if (CONFIG.is_multicast) {
      if (
        GLOBAL_DATA_UI.status_control_robot[0] ||
        GLOBAL_DATA_UI.status_control_robot[1] ||
        GLOBAL_DATA_UI.status_control_robot[2] ||
        GLOBAL_DATA_UI.status_control_robot[3] ||
        GLOBAL_DATA_UI.status_control_robot[4]
      ) {
        const temp_data = BASESTATION.writeBS2PCData();
        UDP_MULTICAST.send(temp_data.buffer_data, 0, temp_data.byte_counter, PORT_MULTICAST, GROUP);
      }
    } else {
      const len_robot = ROBOTS.length;
      for (let i = 0; i < len_robot; i++) {
        const ROBOT = ROBOTS[i];
        const ROBOT_IP = ROBOT.self_data.ip;
        if (ROBOT.is_connected && GLOBAL_DATA_UI.status_control_robot[i]) {
          const temp_data = BASESTATION.writeBS2PCData();
          UDP_UNICAST.send(temp_data.buffer_data, PORT_UNICAST, ROBOT_IP);
        }
      }
    }
  } catch (e) {
    console.log("error write ", e);
  }
}, TIMER_BS_TO_PC_MS);
