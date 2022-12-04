import net from "net";
import { spawn } from "child_process";
import EventEmitter from "events";

function main({ port, cmd }: { port: number; cmd: string }) {
  const events: EventEmitter[] = [];

  const whisper = spawn(cmd);

  whisper.stdout.on("data", (data) => {
    const msg = data.toString().trim();
    console.log(msg);
    events.forEach((event) => {
      event.emit("data", msg);
    });
  });

  const server = net
    .createServer(function (conn) {
      console.log("server-> tcp server created");
      const event = new EventEmitter();
      events.push(event);
      event.on("data", function (data) {
        const msg = data.toString();
        const a = data.toString().split("\r");
        if (a.length > 2) {
          let data = a[2];
          const m = msg.match(/\(.+\)(.*)/);
          if (m) {
            if (m[2]) {
              data = m[2].trim();
            } else {
              data = "";
            }
          }
          if (data.indexOf("お前は") >= 0 || data == "") {
          } else {
            conn.write(data.trim());
          }
        }
      });
      conn.on("data", function (data) {
        console.log("server-> " + data + " from " + conn.remoteAddress + ":" + conn.remotePort);
        conn.write(`[接続:${data.toString().trim()}]`);
      });
      conn.on("close", function () {
        console.log("server-> client closed connection");
        const removeEvent = (event: EventEmitter) => {
          const idx = events.indexOf(event);
          events.splice(idx, 1);
        };
        removeEvent(event);
      });
    })
    .listen(port);

  console.log(`listening on port ${port}`);
}

if (require.main === module) {
  const PORT = parseInt(process.env["PORT"] || "42001");
  const WHISPER = process.env["WHISPER"] || "./whisper-test.sh";
  main({ port: PORT, cmd: WHISPER });
}
