import getEnv from "./getEnv.ts";

const BLOCKLIST_FILE = getEnv("BLOCKLIST_FILE");
if (!BLOCKLIST_FILE) {
  throw new Error("BLOCKLIST_FILE env var not defined");
}

const isTest = Boolean(getEnv("TEST"));

async function banIp(ipAddress: string, metadata: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${ipAddress} # ${metadata}\n`);
  Deno.writeFileSync(BLOCKLIST_FILE, data, {
    append: true,
    create: true,
  });

  if (isTest) {
    console.log("skip iptables rule addition because of test");
    return;
  }

  const p = Deno.run({
    cmd: [
      "/usr/sbin/iptables",
      "-I",
      "DOCKER-USER",
      "-s",
      `${ipAddress}`,
      "-j",
      "REJECT",
    ],
  });

  await p.status();
}

export default banIp;
