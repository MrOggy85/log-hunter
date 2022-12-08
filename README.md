# log-hunter

This is a very novel version of Fail2ban.

I made this since I wanted a custom solution for monitoring my server. It's
tailored to my specific needs, which is:

- Easily provide log files to monitor
- Easily specify patterns to match
- Easily report when a new ban is in effect
- Ban IPs via `iptables` when server is running `docker`

## Features

- Parse log files checking for _specific patterns_
- Ban IPs via `iptables` matching the pattern in `DOCKER-USER` chain
- Report a new ban via Slack
- Lookup IP metadata via [ipapi](https://ipapi.co/)

## Usage

- install [`deno`](https://deno.land/)

### Set Environment Variables

- `BLOCKLIST_FILE` - File to permantently store IP addresses
- `WHITELIST` - Comma separated string to specify IP addresses not to ban
- `LOG_FILES` - Comma separated string to specify full path to log files to
  check

#### **Slack report**

This uses the `chat.postMessage` api to send reports. Please setup a slack bot
in order to get the auth bearer token.

- `SLACK_AUTH` - Bearer token
- `SLACK_CHANNEL` - Channel to post in (make sure your bot is in this channel)
- `SLACK_USERNAME` - Username to post as

#### **Optional**

- `TAIL_LINES` - number of lines to check in log files (default: `500`)

### Run/Start

It's recommended to run this via cron on a schedule that suits your needs.

```sh
./run.sh
```

## Todo

- [ ] Add AbuseIPDB check (https://www.abuseipdb.com)
- [ ] Add AbuseIPDB report (https://www.abuseipdb.com)
- [ ] Provide patterns via file instead of hard code
- [ ] make bans temporary instead of permanent
- [ ] keep permanent record of banned IPs (in case of new offense) a.k.a
      indefinite probation
  - blocklist.txt = currently in jail
  - offenders.txt = historical list of all IPs
