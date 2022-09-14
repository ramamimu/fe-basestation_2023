const BASESTATION = require("./class/Basestation");
const HOST = BASESTATION.host;
const GROUP = BASESTATION.group;
const PORT_RX = BASESTATION.port_rx;
const PORT_TX = BASESTATION.port_tx;
const UDP_SOCKET_RX = BASESTATION.udp_socket_rx;
const UDP_SOCKET_TX = BASESTATION.udp_socket_tx;
const WEB_SOCKET = BASESTATION.web_socket;
const {
  TIMER_SERVER_UPDATE_DATA_MS,
  TIMER_BS_TO_PC_MS,
} = require("./utils/init_data");

const EMITTER = {
  SERVER_TO_UI: "server2ui",
  UI_TO_SERVER: "ui2server",
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

// BINDING

UDP_SOCKET_RX.bind(PORT_RX, HOST, () => {
  console.log(`udp ${HOST} connected`);
});

UDP_SOCKET_TX.bind(PORT_TX, HOST, () => {
  console.log(`udp ${HOST} connected`);
});

//  WEB SOCKET

WEB_SOCKET.on("connection", (onConnect) => {
  onConnect.on(EMITTER.UI_TO_SERVER, (item) => {
    BASESTATION.setDataFromUI(item);
  });
});

// ON MESSAGE

UDP_SOCKET_RX.on("message", (message, remote) => {
  BASESTATION.readPC2BSData(message);
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
    UDP_SOCKET_TX.send(
      temp_data.buffer_data,
      0,
      temp_data.byte_counter,
      PORT_TX,
      GROUP
    );
  } catch (e) {
    console.log("error write ", e);
  }
}, TIMER_BS_TO_PC_MS);
