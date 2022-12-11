import net from "net";

function main({ serverHost, serverPort }: { serverHost: string; serverPort: number }) {
  const connect = () => {
    //. 接続
    const client = new net.Socket();
    client.connect(serverPort, serverHost, function () {
      console.log(`[接続:${serverPort}:${serverPort}]`);
      //. サーバーへメッセージを送信
      client.write("Hello");
    });

    //. サーバーからメッセージを受信したら、その内容を表示する
    client.on("data", function (data) {
      console.log(`${data.toString()}`);
    });

    client.on("error", function (err) {
      console.log("serverに接続できません " + serverHost + ", port " + serverPort);
      // console.log(err);
    });

    //. 接続が切断されたら、その旨をメッセージで表示する
    client.on("close", function () {
      console.log("[切断]");
      // 再接続
      setTimeout(() => {
        connect();
      }, 3000);
    });
  };
  connect();
}

if (require.main === module) {
  const SERVER_HOST = process.env["SERVER_HOST"] || "localhost";
  const SERVER_PORT = parseInt(process.env["SERVER_PORT"] || "42001");
  main({ serverHost: SERVER_HOST, serverPort: SERVER_PORT });
}
