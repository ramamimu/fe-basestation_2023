const BASESTATION = require("./class/Basestation");
const HOST = BASESTATION.host;
const GROUP = BASESTATION.group;
const PORT_RX = BASESTATION.port_rx;
const PORT_TX = BASESTATION.port_tx;
const UDP_SOCKET_RX = BASESTATION.udp_socket_rx;
const UDP_SOCKET_TX = BASESTATION.udp_socket_tx;
const WEB_SOCKET = BASESTATION.web_socket;

const EMITTER = {
  SERVER_TO_UI: "server2ui",
  UI_TO_SERVER: "ui2server",
};

// listening

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

// binding

UDP_SOCKET_RX.bind(PORT_RX, HOST, () => {
  console.log(`udp ${HOST} connected`);
});

UDP_SOCKET_TX.bind(PORT_TX, HOST, () => {
  console.log(`udp ${HOST} connected`);
});

//  web socket

WEB_SOCKET.on("connection", (onConnect) => {
  onConnect.on(EMITTER.UI_TO_SERVER, (item) => {
    BASESTATION.setDataFromUI(item);
  });
});

// on message

UDP_SOCKET_RX.on("message", (message, remote) => {
  BASESTATION.readPC2BSData(message);
});

// ---------- TACKLE DYNAMIC DATA ---------- //
// update data processing
// mux to every single robot
// copy global data for each robot
setInterval(() => {
  BASESTATION.updateData();
}, 50);

// ---------- WRITE AND SEND DATA TO ROBOT ---------- //
setInterval(() => {
  console.log(`r1: ${BASESTATION.robot[0].is_active} `);
  try {
    const LEN_ROBOT = BASESTATION.robot.length;
    for (let i = 0; i < LEN_ROBOT; i++) {
      const temp_data = BASESTATION.writeBS2PCData(i);
      UDP_SOCKET_TX.send(
        temp_data.buffer_data,
        0,
        temp_data.byte_counter,
        PORT_TX,
        GROUP
      );
    }
  } catch (e) {
    console.log("error write ", e);
  }
}, 100);
