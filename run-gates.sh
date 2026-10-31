#!/usr/bin/env bash
# Local gate runner: serves dist/public and runs the five browser suites. Usage: bash run-gates.sh
export PW_CHROMIUM="${PW_CHROMIUM:-C:/Program Files/Google/Chrome/Application/chrome.exe}"
npx vite preview --port 4173 --strictPort >/tmp/preview.log 2>&1 &
PID=$!
sleep 4
rc=0
for s in wave-a wave-b-builder wave-b-practice wave-b-pwa wave-c-a11y; do
  echo "=== $s"; node e2e/$s.mjs http://localhost:4173 2>&1 | tail -4 || rc=1
  [ "${PIPESTATUS[0]}" -ne 0 ] && rc=1
done
kill $PID 2>/dev/null
echo "GATES rc=$rc"; exit $rc
