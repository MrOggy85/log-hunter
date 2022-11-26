import fetchIpAddressData from "./fetchIpAddressData.ts";
import getEnv from "./getEnv.ts";

async function checkLogs() {
  const isTesting = Boolean(getEnv("TEST"));
  const TAIL_LINES = getEnv("TAIL_LINES");
  const LOG_FILES = getEnv("LOG_FILES");

  const logFiles = LOG_FILES.split(",");
  console.log("logFiles", logFiles);

  const tailLines = TAIL_LINES ? Number(TAIL_LINES) : 500;

  const cmd = isTesting
    ? ["tail", "-n", "500", "./fixtures/read.log"]
    : ["tail", "-n", `${tailLines}`, ...logFiles];

  const p = Deno.run({
    cmd,
    stdout: "piped",
  });

  const { code } = await p.status();

  const rawOutput = await p.output();

  const rawText = new TextDecoder().decode(rawOutput);

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
    country: string;
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

  for (const row of allRows) {
    if (!row) {
      continue;
    }
    const { path, ipAddress, date } = splitIntoParts(row);
    const isInViolation = violations.find((x) => path.indexOf(x.path) !== -1);

    if (isInViolation) {
      const data = await fetchIpAddressData(ipAddress);

      bannedIps.push({
        ipAddress,
        country: data.country_name,
        banDate: new Date().toLocaleString(),
        logDate: date,
        reason: `path: ${path}`,
        severity: isInViolation.severity,
      });
    }
  }

  if (code !== 0) {
    console.log("Error", code);
    Deno.exit(1);
  }
}

export default checkLogs;
