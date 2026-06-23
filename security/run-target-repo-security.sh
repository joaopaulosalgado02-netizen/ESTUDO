#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCANNER="$ROOT_DIR/security/static-site-security-check.sh"
REPORT_DIR="$ROOT_DIR/security/reports"
TARGETS="FCEMP LF CONCREFORT"
BASE_DIR="${1:-$(dirname "$ROOT_DIR")}"

mkdir -p "$REPORT_DIR"

echo "== Target repository security runner =="
echo "Base dir: $BASE_DIR"
echo "Reports: $REPORT_DIR"
echo

overall_status=0

for repo in $TARGETS; do
  repo_path=""

  for candidate in "$BASE_DIR/$repo" "$ROOT_DIR/$repo" "$repo"; do
    if [ -d "$candidate" ]; then
      repo_path="$candidate"
      break
    fi
  done

  report_file="$REPORT_DIR/${repo}-security-report.txt"
  repo_status=0

  {
    echo "Repository: $repo"
    echo "Checked at: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    echo

    if [ -z "$repo_path" ]; then
      echo "Status: NOT_FOUND"
      echo "Expected one of:"
      echo "- $BASE_DIR/$repo"
      echo "- $ROOT_DIR/$repo"
      echo "- $(pwd)/$repo"
    else
      echo "Status: FOUND"
      echo "Path: $repo_path"
      echo

      if git -C "$repo_path" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        echo "Git branch:"
        git -C "$repo_path" status --short --branch
        echo
        echo "Git remote:"
        git -C "$repo_path" remote -v
        echo
      fi

      bash "$SCANNER" "$repo_path"
      repo_status=$?
    fi
  } >"$report_file" 2>&1
  write_status=$?
  if [ "$write_status" -ne 0 ]; then
    repo_status="$write_status"
  fi
  if [ "$repo_status" -ne 0 ]; then
    overall_status=1
  fi

  echo "[$repo] report: $report_file"
  if grep -q 'Status: NOT_FOUND' "$report_file"; then
    echo "[$repo] not found"
  elif [ "$repo_status" -eq 0 ]; then
    echo "[$repo] no HIGH/MEDIUM findings from static scanner"
  else
    echo "[$repo] review HIGH/MEDIUM findings"
  fi
  echo
done

exit "$overall_status"
