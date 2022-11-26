#!/bin/bash

echo "start app..."
export CHECK_INTERVAL=5000

deno run \
  --allow-run \
  --allow-env \
  --allow-net \
  --allow-read \
  --allow-write \
  ./src/main.ts
