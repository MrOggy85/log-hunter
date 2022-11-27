type KEY =
  | "CHECK_COOLDOWN"
  | "TEST"
  | "TAIL_LINES"
  | "LOG_FILES"
  | "SLACK_AUTH"
  | "SLACK_CHANNEL"
  | "SLACK_USERNAME"
  | "BLOCKLIST_FILE"
  | "WHITELIST"
  | "ENDLESS";

function getEnv(key: KEY) {
  return Deno.env.get(key) || "";
}

export default getEnv;
