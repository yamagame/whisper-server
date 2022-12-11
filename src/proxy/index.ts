import net from "net";

function main({
  serverPort,
  serverHost,
  proxyPort,
}: {
  serverPort: number;
  serverHost: string;
  proxyPort: number;
}) {
  net
    .createServer(function (proxySocket) {
      var connected = false;
      var buffers = new Array();
      var targetSocket = new net.Socket();
      targetSocket.connect(serverPort, serverHost, function () {
        connected = true;
        if (buffers.length > 0) {
          for (let i = 0; i < buffers.length; i++) {
            console.log(buffers[i].toString());
            targetSocket.write(buffers[i]);
          }
        }
      });

      proxySocket.on("error", function (e) {
        targetSocket.end();
      });
      targetSocket.on("error", function (e) {
        console.log("targethostに接続できません " + serverHost + ", port " + serverPort);
        proxySocket.end();
      });

      proxySocket.on("data", function (data) {
        console.log("send: " + data.toString()); //送信データ
        if (connected) {
          targetSocket.write(data);
        } else {
          buffers[buffers.length] = data;
        }
      });
      targetSocket.on("data", function (data) {
        console.log("rec: " + data.toString()); //受信データ
        proxySocket.write(data);
      });

      proxySocket.on("close", function (had_error) {
        targetSocket.end();
      });
      targetSocket.on("close", function (had_error) {
        proxySocket.end();
      });
    })
    .listen(proxyPort);
}

if (require.main === module) {
  const PROXY_PORT = parseInt(process.env["PROXY_PORT"] || "42001");
  const PROXY_SERVER_HOST = process.env["PROXY_SERVER_HOST"] || "localhost";
  const PROXY_SERVER_PORT = parseInt(process.env["PROXY_SERVER_PORT"] || "42002");
  main({ serverPort: PROXY_SERVER_PORT, serverHost: PROXY_SERVER_HOST, proxyPort: PROXY_PORT });
}
