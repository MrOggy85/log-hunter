import checkLogs from "./checkLogs.ts";
import getEnv from "./getEnv.ts";

const CHECK_INTERVAL = Number(getEnv("CHECK_INTERVAL"));
console.log("CHECK_INTERVAL", CHECK_INTERVAL);
if (Number.isNaN(CHECK_INTERVAL) || CHECK_INTERVAL < 1000) {
  console.log("CHECK_INTERVAL needs to be higher than 1000", CHECK_INTERVAL);
  Deno.exit(1);
}

setInterval(() => {
  checkLogs();
}, CHECK_INTERVAL);
