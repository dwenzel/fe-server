#!/bin/sh
# wait-for-it.sh - Wait for a service to be available before starting tests
# Usage: wait-for-it.sh host:port [-t timeout] [-- command args]

TIMEOUT=15
QUIET=0
CLI=""

usage() {
  echo "Usage: $0 host:port [-t timeout] [-- command args]"
  echo "  -q | --quiet                  Don't output any status messages"
  echo "  -t TIMEOUT | --timeout=TIMEOUT Timeout in seconds, zero for no timeout"
  echo "  -- COMMAND ARGS               Execute command with args after the test finishes"
  exit 1
}

wait_for() {
  echo "Waiting for $HOST:$PORT..."
  
  start_ts=$(date +%s)
  while :
  do
    nc -z "$HOST" "$PORT" > /dev/null 2>&1
    result=$?
    if [ $result -eq 0 ] ; then
      end_ts=$(date +%s)
      echo "$HOST:$PORT is available after $((end_ts - start_ts)) seconds"
      break
    fi
    
    curr_ts=$(date +%s)
    if [ $TIMEOUT -gt 0 -a $((curr_ts - start_ts)) -ge $TIMEOUT ]; then
      echo "Timeout reached after waiting $TIMEOUT seconds for $HOST:$PORT"
      exit 1
    fi
    
    sleep 1
  done
  return $result
}

parse_arguments() {
  while [ $# -gt 0 ]
  do
    case "$1" in
      *:* )
        HOST=$(printf "%s\n" "$1"| cut -d : -f 1)
        PORT=$(printf "%s\n" "$1"| cut -d : -f 2)
        shift 1
        ;;
      -q | --quiet)
        QUIET=1
        shift 1
        ;;
      -t)
        TIMEOUT="$2"
        if [ -z "$TIMEOUT" ]; then
          usage
        fi
        shift 2
        ;;
      --timeout=*)
        TIMEOUT="${1#*=}"
        shift 1
        ;;
      --)
        shift
        CLI="$@"
        break
        ;;
      --help)
        usage
        ;;
      *)
        echo "Unknown argument: $1"
        usage
        ;;
    esac
  done
  
  if [ "$HOST" = "" -o "$PORT" = "" ]; then
    echo "Error: you need to provide a host and port"
    usage
  fi
}

check_api_health() {
  # Try to get response from API health endpoint
  echo "Checking API health..."
  if wget -q -O /dev/null http://$HOST:$PORT/version; then
    echo "API is accessible"
    return 0
  else
    echo "API endpoint not accessible"
    return 1
  fi
}

# Process arguments
parse_arguments "$@"

# Wait for service to be ready
wait_for
result=$?

# Check API health if waiting was successful
if [ $result -eq 0 ]; then
  # Try to check API health - some APIs may not have a health endpoint
  check_api_health || echo "Continuing anyway - API port is available"
fi

# If a command is provided, run it
if [ -n "$CLI" ]; then
  echo "Executing: $CLI"
  exec $CLI
fi

exit $result