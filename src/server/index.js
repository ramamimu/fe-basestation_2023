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

const N_ROBOT_TO_ARRAY = {
  N_ROBOT_1: 0,
  N_ROBOT_2: 1,
  N_ROBOT_3: 2,
  N_ROBOT_4: 3,
  N_ROBOT_5: 4,
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

WEB_SOCKET.on("connection", async (onConnect) => {
  await onConnect.on(EMITTER.UI_TO_SERVER, async (item) => {
    BASESTATION.setDataFromUI(item);
  });
});

// on message

UDP_SOCKET_RX.on("message", (message, remote) => {
  BASESTATION.readPC2BSData(message);
});

// TACKLE DYNAMIC DATA
// --- update data processing
// - mux to every single robot
// - copy global data to each robot
setInterval(() => {
  BASESTATION.updateData();
}, 50);

setInterval(() => {
  // Basestation.robot.forEach((item, index) => {
  //   console.log(`epoch : ${item.epoch}`);
  // });
  console.log(`r1: ${BASESTATION.robot[0].is_active} `);
  // console.log(`${Basestation.robot[0].pos_x}`);
  // console.log(`${Basestation.robot[0].pos_y}`);
  // console.log(`${Basestation.robot[0].theta}`);
  // console.log(`r2: ${Basestation.robot[1].is_active}`);
  // console.log(`${Basestation.robot[1].pos_x}`);
  // console.log(`${Basestation.robot[1].pos_y}`);
  // console.log(`${Basestation.robot[1].theta}`);
  // console.log(`r4: ${Basestation.robot[3].is_active}`);
  // console.log(`${Basestation.robot[3].pos_x}`);
  // console.log(`${Basestation.robot[3].pos_y}`);
  // console.log(`${Basestation.robot[3].theta}`);
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
