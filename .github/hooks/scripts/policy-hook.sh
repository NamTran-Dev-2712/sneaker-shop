#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-PreToolUse}"
INPUT_JSON="$(cat || true)"
LOWER="$(printf '%s' "$INPUT_JSON" | tr '[:upper:]' '[:lower:]')"

if [[ "$MODE" == "SessionStart" ]]; then
  printf '%s' '{"continue":true,"systemMessage":"Policy active: prefer read/search/edit tools for source changes, avoid destructive terminal commands, and request confirmation for shell-based bulk rewrites."}'
  exit 0
fi

contains() {
  local needle="$1"
  [[ "$LOWER" == *"$needle"* ]]
}

if contains 'rm -rf /' || contains 'rm -rf *' || contains 'del /f /s /q' || contains 'format ' || contains 'shutdown ' || contains 'reboot' || contains 'git reset --hard' || contains 'git clean -fdx' || contains 'remove-item -recurse -force .' || contains 'remove-item -recurse -force *'; then
  printf '%s' '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Blocked potentially destructive command. Use safer scoped command or request explicit override."}}'
  exit 2
fi

if contains ' > ' || contains '>>' || contains 'sed -i' || contains 'perl -pi' || contains 'tee ' || contains 'out-file' || contains 'set-content' || contains 'add-content'; then
  printf '%s' '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"Shell-based file rewrite detected. Prefer edit tools for auditable diffs."}}'
  exit 0
fi

printf '%s' '{"continue":true}'
exit 0
