import getEnv from "./getEnv.ts";

const SLACK_AUTH = getEnv("SLACK_AUTH");
if (!SLACK_AUTH) {
  throw new Error("no SLACK_AUTH env var");
}
const SLACK_CHANNEL = getEnv("SLACK_CHANNEL");
if (!SLACK_CHANNEL) {
  throw new Error("no SLACK_CHANNEL env var");
}
const SLACK_USERNAME = getEnv("SLACK_USERNAME");
if (!SLACK_USERNAME) {
  throw new Error("no SLACK_USERNAME env var");
}

async function sendSlackMessage(text: string) {
  await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SLACK_AUTH}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "channel": SLACK_CHANNEL,
      text,
      "username": SLACK_USERNAME,
    }),
  });
}

export default sendSlackMessage;
