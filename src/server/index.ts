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
      // let timeout: NodeJS.Timeout;
      const event = new EventEmitter();
      events.push(event);
      event.on("data", function (data) {
        const msg = data.toString();
        const a = data.toString().split("\r");
        if (a.length > 2) {
          data = a[2];
        }
        const m = msg.match(/\(.+\)(.*)/);
        if (m) {
          if (m[1]) {
            data = m[1].trim();
          } else {
            data = "";
          }
        }
        if (data.indexOf(":") >= 0 || data == "") {
        } else {
          // if (timeout) clearTimeout(timeout);
          // timeout = setTimeout(() => {
          conn.write(data.trim());
          // }, 1000);
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
      conn.on("error", function (err) {
        console.log(err);
      });
    })
    .listen(port);

  console.log(`listening on port ${port}`);
}

if (require.main === module) {
  const PORT = parseInt(process.env["PORT"] || "42002");
  const WHISPER = process.env["WHISPER_COMMAND"] || "./whisper-test.sh";
  main({ port: PORT, cmd: WHISPER });
}
