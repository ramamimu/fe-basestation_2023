const Basestation = require("./Basestation");

const HOST = Basestation.host;
const GROUP = Basestation.group;
const PORT_RX = Basestation.port_rx;
const UDP_SOCKET = Basestation.udp_socket;

UDP_SOCKET.on("listening", function () {
  var address = UDP_SOCKET.address();
  console.log(
    "UDP Client listening on " + address.address + ":" + address.port
  );
  UDP_SOCKET.setBroadcast(true);
  UDP_SOCKET.setMulticastTTL(64);
  UDP_SOCKET.addMembership(GROUP, HOST);
});

UDP_SOCKET.bind(PORT_RX, HOST, () => {
  console.log(`udp ${HOST} connected`);
  UDP_SOCKET.on("message", (message, remote) => {
    console.log(
      new Date().getTime() +
        " \nB: data From UDP group pc2Bs: " +
        remote.address +
        ":" +
        remote.port +
        " - " +
        message
    );
  });
});
