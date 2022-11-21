#!/bin/bash

deno cache -r src/deps.ts
deno lint ./src
deno fmt --check ./src
deno check ./src/main.ts
