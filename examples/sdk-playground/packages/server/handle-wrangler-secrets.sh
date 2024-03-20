#!/usr/bin/env bash

env=$1
if [ -z "$env" ]
then
  echo "env is required"
  exit 1
fi
mode=$2
if [ -z "$mode" ]
then
  echo "mode is required"
  exit 1
fi

echo "setting wrangler env vars for env=$env mode=$mode"
if [ "$mode" = "local" ]
then
  # for local mode (eg `wranger dev`) wrangler uses a local .dev.vars file
  # https://developers.cloudflare.com/workers/wrangler/configuration/#environmental-variables
  cp ../../.env.$env .dev.vars
else
  # open env file for env
  for var in $(grep -v '^#' ../../.env."$env")
  do
    key=$(sed 's/=.*//g' <<< $var)
    val=$(sed 's/.*=//g' <<< $var)
    echo $val | ./node_modules/.bin/wrangler secret put $key --env $env
  done
fi
