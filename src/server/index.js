const BASESTATION = require("./class/Basestation");
const REFBOX = BASESTATION.refbox;
const HOST = BASESTATION.host;
const GROUP = BASESTATION.group;
const PORT_RX = BASESTATION.port_rx;
const PORT_TX = BASESTATION.port_tx;
const PORT_UNICAST = BASESTATION.port_udp_unicast;
const UDP_SOCKET_RX = BASESTATION.udp_socket_rx;
const UDP_SOCKET_TX = BASESTATION.udp_socket_tx;
const WEB_SOCKET = BASESTATION.web_socket;
const REF_CLIENT = REFBOX.client;
const UDP_UNICAST = BASESTATION.udp_unicast;
const ROBOTS = BASESTATION.robot;
const {
  TIMER_SERVER_UPDATE_DATA_MS,
  TIMER_BS_TO_PC_MS,
} = require("./utils/init_data");

const EMITTER = {
  SERVER_TO_UI: "server2ui",
  UI_TO_SERVER: "ui2server",
  REFBOX: "refbox",
};

// LISTENING SOCKET

UDP_SOCKET_RX.on("listening", function () {
  var address = UDP_SOCKET_RX.address();
  console.log("UDP RX listening on " + address.address + ":" + address.port);
  UDP_SOCKET_RX.setBroadcast(true);
  UDP_SOCKET_RX.setMulticastTTL(64);
  UDP_SOCKET_RX.addMembership(GROUP, HOST);
});

UDP_SOCKET_TX.on("listening", function () {
  var address = UDP_SOCKET_TX.address();
  console.log("UDP TX listening on " + address.address + ":" + address.port);
  UDP_SOCKET_TX.setBroadcast(true);
  UDP_SOCKET_TX.setMulticastTTL(64);
  UDP_SOCKET_TX.addMembership(GROUP, HOST);
});

UDP_UNICAST.on("listening", function () {
  const address = UDP_UNICAST.address();
  UDP_UNICAST.setBroadcast(true);
  console.log(`server listening ${address.address}:${address.port}`);
});

// BINDING

UDP_SOCKET_RX.bind(PORT_RX, HOST, () => {
  console.log(`udp multicast ${HOST} connected`);
});

UDP_SOCKET_TX.bind(PORT_TX, HOST, () => {
  console.log(`udp multicast ${HOST} connected`);
});

UDP_UNICAST.bind(PORT_UNICAST, HOST, () => {
  console.log(`udp unicast ${HOST} connected`);
});

// ON MESSAGE

UDP_SOCKET_RX.on("message", (message, remote) => {
  BASESTATION.readPC2BSData(message);
});

UDP_UNICAST.on("message", (message, remote) => {
  console.log(`server got: ${message} from ${remote.address}:${remote.port}`);
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
    const temp_data = BASESTATION.writeBS2PCData();
    // UDP_SOCKET_RX.send(
    //   temp_data.buffer_data,
    //   0,
    //   temp_data.byte_counter,
    //   PORT_RX,
    //   GROUP
    // );
    // UDP_UNICAST.send(
    //   `hello ${new Date().getTime()}`,
    //   PORT_UNICAST,
    //   ROBOTS[0].self_data.ip
    // );
  } catch (e) {
    console.log("error write ", e);
  }
}, TIMER_BS_TO_PC_MS);
