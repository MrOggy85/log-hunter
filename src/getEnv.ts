type KEY = "CHECK_INTERVAL" | "TEST" | "TAIL_LINES" | "LOG_FILES";

function getEnv(key: KEY) {
  return Deno.env.get(key) || "";
}

export default getEnv;
