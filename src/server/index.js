const Basestation = require("./Basestation");

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

// on message

UDP_SOCKET_RX.on("message", (message, remote) => {
  console.log(
    new Date().getTime() +
      " \nB: data From UDP group pc2Bs: " +
      remote.address +
      ":" +
      remote.port
  );
  //   + " - " + message
  Basestation.getPc2BsData(message);
  Basestation.sendDataToUI();
});

// UDP_SOCKET_TX.on("message", (message, remote) => {
//   console.log(
//     new Date().getTime() +
//       " \nB: data From UDP group pc2Bs: " +
//       remote.address +
//       ":" +
//       remote.port +
//       " - " +
//       message
//   );
// });

setInterval(() => {
  const setering = "ini sebuah string";
  UDP_SOCKET_TX.send(setering, 0, setering.length, PORT_TX, GROUP);
}, 25);
