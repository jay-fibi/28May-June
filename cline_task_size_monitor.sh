#!/usr/bin/env bash
#
# cline_task_size_monitor.sh
# ---------------------------
# Replicates Cline's "Task Storage Size" calculation by summing the byte
# sizes of every file under the extension's `tasks/` directory.
#
# Cline (and Cline Nightly) store each conversation as a folder under:
#   ~/Library/Application Support/Code/User/globalStorage/<ext-id>/tasks/
# Each task folder typically contains:
#   - api_conversation_history.json   (raw API messages)
#   - ui_messages.json                (what you see in the UI)
#   - task_metadata.json              (file context / model info)
#   - checkpoints/ and other artifacts (when enabled)
#
# The Settings UI total = sum of sizes of all files in tasks/ (recursive).
#
# Usage:
#   ./cline_task_size_monitor.sh            # auto-detect cline or cline-nightly
#   ./cline_task_size_monitor.sh nightly    # force nightly
#   ./cline_task_size_monitor.sh stable     # force stable
#   ./cline_task_size_monitor.sh watch      # re-measure every 5s (Ctrl-C to stop)

set -euo pipefail

GS="$HOME/Library/Application Support/Code/User/globalStorage"
STABLE="$GS/saoudrizwan.claude-dev"
NIGHTLY="$GS/saoudrizwan.cline-nightly"

pick_base() {
  case "${1:-auto}" in
    stable)  echo "$STABLE" ;;
    nightly) echo "$NIGHTLY" ;;
    *)
      if [ -d "$NIGHTLY/tasks" ]; then echo "$NIGHTLY"
      elif [ -d "$STABLE/tasks" ]; then echo "$STABLE"
      else echo ""; fi
      ;;
  esac
}

human() {
  awk -v b="$1" 'BEGIN{
    split("B KB MB GB TB",u," "); i=1;
    while (b>=1024 && i<5){b/=1024;i++}
    printf (i==1 ? "%d %s" : "%.2f %s"), b, u[i]
  }'
}

measure() {
  local base="$1" tasks="$1/tasks"
  [ -d "$tasks" ] || { echo "No tasks directory at: $tasks"; return 1; }

  local total folders files
  total=$(find "$tasks" -type f -print0 2>/dev/null | xargs -0 stat -f%z 2>/dev/null | awk '{s+=$1} END{print s+0}')
  folders=$(find "$tasks" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
  files=$(find "$tasks" -type f 2>/dev/null | wc -l | tr -d ' ')

  echo "Extension : $(basename "$base")"
  echo "Tasks dir : $tasks"
  echo "Tasks     : $folders folder(s), $files file(s)"
  echo "TOTAL SIZE: $(human "$total")  ($total bytes)"

  if [ "$folders" -gt 0 ]; then
    echo "---- per-task breakdown ----"
    for d in "$tasks"/*/; do
      [ -d "$d" ] || continue
      local b
      b=$(find "$d" -type f -print0 2>/dev/null | xargs -0 stat -f%z 2>/dev/null | awk '{s+=$1} END{print s+0}')
      printf "  %-26s %s\n" "$(basename "$d")" "$(human "$b")"
    done
  fi
  echo "$total" > /tmp/.cline_last_size
}

main() {
  local arg="${1:-auto}"
  if [ "$arg" = "watch" ]; then
    local base; base="$(pick_base auto)"
    [ -n "$base" ] || { echo "No Cline storage found."; exit 1; }
    echo "Watching $(basename "$base") tasks size (Ctrl-C to stop)..."
    while true; do
      clear; date; echo; measure "$base"; sleep 5
    done
  else
    local base; base="$(pick_base "$arg")"
    [ -n "$base" ] || { echo "No Cline storage found in $GS"; exit 1; }
    measure "$base"
  fi
}

main "$@"
