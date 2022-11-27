import getEnv from "./getEnv.ts";

type TARGET = "REJECT" | "RETURN";

const isTesting = Boolean(getEnv("TEST"));

/**
 * Output of command:
 * `iptables -v -n -L DOCKER-USER`
 */
async function getBannedIps() {
  const cmd = isTesting
    ? ["cat", "./fixtures/iptables-output.txt"]
    : ["/usr/sbin/iptables", "-v", "-n", "-L", "DOCKER-USER"];

  const p = Deno.run({
    cmd,
    stdout: "piped",
  });

  await p.status();

  const o = await p.output();

  const iptablesRawText = new TextDecoder().decode(o);

  let targetEnd = -1;
  let bytesEnd = -1;
  let sourceStart = -1;
  let sourceEnd = -1;

  const bannedIps: string[] = [];

  iptablesRawText.split("\n").forEach((x, i) => {
    if (i === 0) {
      return;
    } else if (i === 1) {
      targetEnd = x.lastIndexOf("target") + 6;
      bytesEnd = x.indexOf("bytes") + 5;
      sourceStart = x.indexOf("source");
      return;
    }
    const target = x.substring(bytesEnd + 1, targetEnd) as TARGET;
    if (target !== "REJECT") {
      return;
    }

    sourceEnd = x.indexOf(" ", sourceStart);
    const ipAddress = x.substring(sourceStart, sourceEnd);

    bannedIps.push(ipAddress);
  });

  return bannedIps;
}

export default getBannedIps;
