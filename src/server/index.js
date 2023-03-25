const { data } = require("autoprefixer");
const BASESTATION = require("./class/Basestation");

const REFBOX = BASESTATION.refbox;
const REF_CLIENT = REFBOX.client;

const WEB_SOCKET = BASESTATION.web_socket;
const EMITTER = {
  SERVER_TO_UI: "server2ui",
  UI_TO_SERVER: "ui2server",
  REFBOX: "refbox",
};

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
  REFBOX.status = false;
  BASESTATION.setRefboxData();
  console.log("Refbox CLOSE");
});

REF_CLIENT.on("error", function () {
  REFBOX.status = false;
  BASESTATION.setRefboxData();
  console.log("Refbox ERROR");
});
