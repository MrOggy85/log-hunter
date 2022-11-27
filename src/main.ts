import checkLogs from "./checkLogs.ts";
import getEnv from "./getEnv.ts";
import sleep from "./sleep.ts";

const CHECK_COOLDOWN = Number(getEnv("CHECK_COOLDOWN"));
console.log("CHECK_COOLDOWN", CHECK_COOLDOWN);
if (Number.isNaN(CHECK_COOLDOWN) || CHECK_COOLDOWN < 2) {
  console.log("CHECK_COOLDOWN needs to be higher than 1", CHECK_COOLDOWN);
  Deno.exit(1);
}

async function start() {
  await checkLogs();
  await sleep(CHECK_COOLDOWN);
  start();
}

start();
