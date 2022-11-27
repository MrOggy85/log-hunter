async function sleep(seconds: number) {
  const p = Deno.run({
    cmd: ["sleep", `${seconds}`],
  });

  await p.status();
}

export default sleep;
