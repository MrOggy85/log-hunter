import checkLogs from "./checkLogs.ts";
import getEnv from "./getEnv.ts";
import sleep from "./sleep.ts";

const CHECK_COOLDOWN = Number(getEnv("CHECK_COOLDOWN"));
console.log("CHECK_COOLDOWN", CHECK_COOLDOWN);
if (Number.isNaN(CHECK_COOLDOWN) || CHECK_COOLDOWN < 2) {
  console.log("CHECK_COOLDOWN needs to be higher than 1", CHECK_COOLDOWN);
  Deno.exit(1);
}

const ENDLESS = Boolean(getEnv("ENDLESS"));
console.log("ENDLESS?", ENDLESS);

async function start() {
  console.log("start...");
  await checkLogs();
  if (ENDLESS) {
    console.log(`check finished. Sleeping for ${CHECK_COOLDOWN} seconds...`);
    await sleep(CHECK_COOLDOWN);
    start();
  } else {
    console.log("check finished. Exit");
    Deno.exit(0);
  }
}

start();
