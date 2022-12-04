import net from "net";

function main({ host, port }: { host: string; port: number }) {
  const connect = () => {
    //. 接続
    const client = new net.Socket();
    client.connect(port, host, function () {
      console.log(`[接続:${host}:${port}]`);
      //. サーバーへメッセージを送信
      client.write("Hello");
    });

    //. サーバーからメッセージを受信したら、その内容を表示する
    client.on("data", function (data) {
      console.log(`${data.toString()}`);
    });

    client.on("error", function (err) {
      console.log(err);
    });

    //. 接続が切断されたら、その旨をメッセージで表示する
    client.on("close", function () {
      console.log("切断");
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
  main({ host: SERVER_HOST, port: SERVER_PORT });
}
