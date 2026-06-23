#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCANNER="$ROOT_DIR/security/static-site-security-check.sh"
TMP_DIR="$(mktemp -d)"
failures=0

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

write_file() {
  target_file="$1"
  shift
  mkdir -p "$(dirname "$target_file")"
  printf '%s\n' "$@" >"$target_file"
}

run_case() {
  name="$1"
  expected_status="$2"
  target_dir="$3"
  output_file="$TMP_DIR/${name}.out"

  bash "$SCANNER" "$target_dir" >"$output_file" 2>&1
  status=$?

  if [ "$expected_status" = "pass" ] && [ "$status" -ne 0 ]; then
    echo "[FAIL] $name expected pass, got exit $status"
    cat "$output_file"
    failures=$((failures + 1))
    return
  fi

  if [ "$expected_status" = "fail" ] && [ "$status" -eq 0 ]; then
    echo "[FAIL] $name expected fail, got exit 0"
    cat "$output_file"
    failures=$((failures + 1))
    return
  fi

  echo "[PASS] $name"
}

assert_output_contains() {
  name="$1"
  pattern="$2"
  output_file="$TMP_DIR/${name}.out"

  if ! grep -Eq "$pattern" "$output_file"; then
    echo "[FAIL] $name missing pattern: $pattern"
    cat "$output_file"
    failures=$((failures + 1))
  fi
}

safe_site="$TMP_DIR/safe-site"
write_file "$safe_site/index.html" \
  '<!doctype html>' \
  '<html lang="pt-BR">' \
  '<head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Safe</title></head>' \
  '<body>' \
  '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Example</a>' \
  '<form action="/contato" method="post"><input name="email" type="email" required></form>' \
  '<script src="app.js"></script>' \
  '</body></html>'
write_file "$safe_site/app.js" \
  'const title = document.querySelector("title");' \
  'title.textContent = "Safe";'
run_case "safe-site" "pass" "$safe_site"

xss_site="$TMP_DIR/xss-site"
write_file "$xss_site/index.html" \
  '<!doctype html>' \
  '<html><body>' \
  '<a href="https://example.com" target="_blank">Example</a>' \
  '<img src="x" onerror="alert(1)">' \
  '<script>document.body.innerHTML = location.hash;</script>' \
  '</body></html>'
run_case "xss-site" "fail" "$xss_site"
assert_output_contains "xss-site" 'API perigosa|Handler inline|target=_blank'

secret_site="$TMP_DIR/secret-site"
write_file "$secret_site/config.js" \
  'const apiKey = "example-token-for-test";' \
  'const endpoint = "http://api.example.com";'
write_file "$secret_site/.env" \
  'TOKEN=example'
run_case "secret-site" "fail" "$secret_site"
assert_output_contains "secret-site" 'Possivel segredo|http://|Arquivos sensiveis'

package_site="$TMP_DIR/package-site"
write_file "$package_site/package.json" \
  '{"scripts":{"build":"echo build"}}'
run_case "package-site" "fail" "$package_site"
assert_output_contains "package-site" 'package.json sem lockfile'

echo
if [ "$failures" -gt 0 ]; then
  echo "Scanner tests failed: $failures"
  exit 1
fi

echo "Scanner tests passed."
exit 0
