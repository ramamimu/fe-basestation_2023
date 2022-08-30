const Basestation = require("./class/Basestation");

const HOST = Basestation.host;
const GROUP = Basestation.group;
const PORT_RX = Basestation.port_rx;
const PORT_TX = Basestation.port_tx;
const UDP_SOCKET_RX = Basestation.udp_socket_rx;
const UDP_SOCKET_TX = Basestation.udp_socket_tx;
const WEB_SOCKET = Basestation.web_socket;

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

WEB_SOCKET.on("connection", (onSocket) => {
  onSocket.on("my message", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setHeader", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setCommand", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setBolaXPadaLapangan", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setBolaYPadaLapangan", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setAutoKalibrasi", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setOdometryOffsetRobotX", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setOdometryOffsetRobotY", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setOdometryOffsetRobotTheta", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setTargetManualX", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setTargetManualY", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setTargetManualTheta", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setDataNRobotMux1", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setDataNRobotMux2", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setTrimKecepatanRobot1", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setTrimKecepatanRobot1", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setTrimKecepatanRobot2", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setTrimKecepatanRobot3", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setTrimKecepatanRobot4", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setTrimKecepatanSudutRobot5", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setTrimPenendangRobot1", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setTrimPenendangRobot2", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setTrimPenendangRobot3", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setTrimPenendangRobot4", (data) => {
    console.log("message from ui = ", data);
  });
  onSocket.on("setTrimPenendangRobot5", (data) => {
    console.log("message from ui = ", data);
  });
});

// on message

UDP_SOCKET_RX.on("message", (message, remote) => {
  // console.log(
  //   new Date().getTime() +
  //     " \nB: data From UDP group pc2Bs: " +
  //     remote.address +
  //     ":" +
  //     remote.port
  // );
  Basestation.readPC2BSData(message);
  // console.log("he aku nompo");
  Basestation.sendDataToUI();
});

setInterval(() => {
  Basestation.updateData();
  // Basestation.robot.forEach((item, index) => {
  //   console.log(`epoch : ${item.epoch}`);
  // });
  console.log(`r1: ${Basestation.robot[0].is_active} `);
  console.log(`${Basestation.robot[0].pos_x}`);
  console.log(`${Basestation.robot[0].pos_y}`);
  console.log(`${Basestation.robot[0].theta}`);
  console.log(`r2: ${Basestation.robot[1].is_active}`);
  console.log(`${Basestation.robot[1].pos_x}`);
  console.log(`${Basestation.robot[1].pos_y}`);
  console.log(`${Basestation.robot[1].theta}`);
  console.log(`r4: ${Basestation.robot[3].is_active}`);
  console.log(`${Basestation.robot[3].pos_x}`);
  console.log(`${Basestation.robot[3].pos_y}`);
  console.log(`${Basestation.robot[3].theta}`);
  try {
    const temp_data = Basestation.writeBS2PCData();
    UDP_SOCKET_RX.send(
      temp_data.buffer_data,
      0,
      temp_data.byte_counter,
      PORT_RX,
      GROUP
    );
  } catch (e) {
    console.log("error write ", e);
  }
}, 100);
