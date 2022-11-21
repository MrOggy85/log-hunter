const p = Deno.run({
  cmd: ["tail", "-n", "100", "./fixtures/read.log"],
  stdout: "piped",
});

const { code } = await p.status();

const rawOutput = await p.output();

const rawText = new TextDecoder().decode(rawOutput);
// console.log("hej", hej);

const allRows: string[] = [];

rawText.split("\n").forEach((row, i) => {
  // console.log(i, x);
  if (!allRows.includes(row)) {
    allRows.push(row);
  }
});

function splitIntoParts(row: string) {
  if (!row) {
    return;
  }
  const parts1 = row.split(" - -");
  const ipAddress = parts1[0];
  // console.log("ipAddress", ipAddress);
  const parts2 = parts1[1];

  const dateStartIndex = parts2.indexOf("[") + 1;
  const dateEndIndex = parts2.indexOf("]");
  const date = parts2.substring(dateStartIndex, dateEndIndex);
  // console.log("date", date);

  const part3 = parts2.substring(dateEndIndex + 2);
  // console.log("part3", part3);
  const requestStartIndex = part3.indexOf('"') + 1;
  const requestEndIndex = part3.lastIndexOf('"');
  const request = part3.substring(requestStartIndex, requestEndIndex);
  // console.log("request", request);
  const requestParts = request.split(" ");
  const httpVerb = requestParts[0];
  const path = requestParts[1];
  const httpProtocol = requestParts[2];
  console.log({
    ipAddress,
    date,
    httpVerb,
    path,
    httpProtocol,
  });
}

allRows.forEach((row) => {
  splitIntoParts(row);
});

// console.log("allRows", allRows);

if (code === 0) {
  // await Deno.stdout.write(rawOutput);
} else {
  Deno.exit(1);
}

Deno.exit(0);
