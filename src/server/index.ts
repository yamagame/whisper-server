import net from "net";
import { spawn } from "child_process";
import EventEmitter from "events";
import psTree from "ps-tree";

const ignore = [
  "おはようございます。",
  "ご視聴ありがとうございました",
  "んーーー",
  "お前は",
  "この動画",
  "スタッフの方が良いです。",
  "今までの動画を",
  "んんん",
  "スッッッッ",
  "スタッフの",
  "【",
  "1.",
  "-",
];

const SIGCONT = 18;
const SIGSTOP = 19;
const SIGTSTP = 20;

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

  whisper.stderr.on("data", (data) => {
    const msg = data.toString().trim();
    console.log(msg);
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
        if (
          data.indexOf(":") >= 0 ||
          data == "" ||
          ignore.some((v) => data.indexOf(v) >= 0) ||
          data.length > 30
        ) {
        } else {
          // if (timeout) clearTimeout(timeout);
          // timeout = setTimeout(() => {
          if (data.split("、").length < 3) {
            conn.write(data.trim());
          }
          // }, 1000);
        }
      });
      conn.on("data", function (data) {
        console.log("server-> " + data + " from " + conn.remoteAddress + ":" + conn.remotePort);
        const msg = data.toString();
        conn.write(`[接続:${data.toString().trim()}]`);
        if (whisper && whisper.pid) {
          if (msg === "<<<stop>>>") {
            console.log(msg);
            console.log(whisper.pid);
            psTree(whisper.pid, (err, children) => {
              children.forEach((v) => {
                console.log(">", v.PID);
                process.kill(parseInt(v.PID), "SIGSTOP");
              });
            });
          }
          if (msg === "<<<start>>>") {
            console.log(msg);
            console.log(whisper.pid);
            psTree(whisper.pid, (err, children) => {
              children.forEach((v) => {
                console.log(">", v.PID);
                process.kill(parseInt(v.PID), "SIGCONT");
              });
            });
          }
        }
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
