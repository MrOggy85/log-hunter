const p = Deno.run({
  cmd: ["tail", "-n", "500", "./fixtures/read.log"],
  stdout: "piped",
});

const { code } = await p.status();

const rawOutput = await p.output();

const rawText = new TextDecoder().decode(rawOutput);

/**
 * Output of command:
 * `iptables -v -n -L DOCKER-USER`
 */
async function getBannedIps() {
  const p = Deno.run({
    cmd: ["cat", "./fixtures/iptables-output.txt"],
    stdout: "piped",
  });

  // const { code } = await p.status();
  await p.status();

  const o = await p.output();

  const iptablesRawText = new TextDecoder().decode(o);
  iptablesRawText.split("\n").forEach((x) => {
    console.log("hej", x.split("\\t"));
  });
}
// console.log("hej", hej);

// const FORBIDDEN_PATHS = ["admin.php"];

type SEVERITY =
  | 0
  | 1
  | 2;

type Violation = {
  path: string;
  severity: SEVERITY;
};

const HIGH_SEVERITY_PATHS = [
  "/admin.php",
  "/wp-content",
  "/wp-commentin.php",
  "/wp-login.php",
  "/class-wp-widget-archives.php",
  "/debug",
  "/.env",
  "/.DS_Store",
  "/ecp/Current/exporttool/microsoft.exchange",
  "/.git",
  "/META-INF",
  "/config.json",
];

const violations: Violation[] = [
  ...HIGH_SEVERITY_PATHS.map((x) => ({
    path: x,
    severity: 2 as const,
  })),
];

type Ban = {
  ipAddress: string;
  banDate: string;
  logDate: string;
  reason: string;
  severity: SEVERITY;
};

const bannedIps: Ban[] = [];

const allRows: string[] = [];

rawText.split("\n").forEach((row, i) => {
  if (!allRows.includes(row)) {
    allRows.push(row);
  }
});

function splitIntoParts(row: string) {
  const parts1 = row.split(" - -");
  const ipAddress = parts1[0];
  const parts2 = parts1[1];

  const dateStartIndex = parts2.indexOf("[") + 1;
  const dateEndIndex = parts2.indexOf("]");
  const date = parts2.substring(dateStartIndex, dateEndIndex);

  const part3 = parts2.substring(dateEndIndex + 2);
  const requestStartIndex = part3.indexOf('"') + 1;
  const requestEndIndex = part3.lastIndexOf('"');
  const request = part3.substring(requestStartIndex, requestEndIndex);
  const requestParts = request.split(" ");
  const httpVerb = requestParts[0];
  const path = requestParts[1];
  const httpProtocol = requestParts[2];

  const part4 = part3.substring(requestEndIndex + 2).split(" ");
  const httpStatusCode = Number(part4[0]);
  const contentLengthInBytes = Number(part4[1]);

  return {
    ipAddress,
    date,
    httpVerb,
    path,
    httpProtocol,
    httpStatusCode,
    contentLengthInBytes,
  };
}

allRows.forEach((row) => {
  if (!row) {
    return;
  }
  const { path, ipAddress, date } = splitIntoParts(row);
  // if (path.indexOf("admin.php") !== -1) {
  //   console.log("path", path);
  // }
  const isInViolation = violations.find((x) => path.indexOf(x.path) !== -1);

  if (isInViolation) {
    // console.log("BAD IP", ipAddress, "because of", path);
    bannedIps.push({
      ipAddress,
      banDate: new Date().toLocaleString(),
      logDate: date,
      reason: `path: ${path}`,
      severity: isInViolation.severity,
    });
  }
});

// console.log("bannedIps", bannedIps);

await getBannedIps();

// console.log("allRows", allRows);

if (code === 0) {
  // await Deno.stdout.write(rawOutput);
} else {
  Deno.exit(1);
}

Deno.exit(0);
