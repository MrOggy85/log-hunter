#!/bin/bash

echo "start app..."

deno run \
  --allow-run \
  --allow-env \
  --allow-net \
  --allow-read \
  --allow-write \
  ./src/main.ts
