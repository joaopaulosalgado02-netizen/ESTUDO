#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE_DIR="${1:-$(dirname "$ROOT_DIR")}"
TARGETS="FCEMP LF CONCREFORT"

echo "== Install site security kit =="
echo "Base dir: $BASE_DIR"
echo

installed=0
missing=0

copy_file() {
  source_file="$1"
  target_file="$2"
  target_dir="$(dirname "$target_file")"

  mkdir -p "$target_dir"
  cp "$source_file" "$target_file"
}

for repo in $TARGETS; do
  repo_path=""

  for candidate in "$BASE_DIR/$repo" "$ROOT_DIR/$repo" "$repo"; do
    if [ -d "$candidate" ]; then
      repo_path="$candidate"
      break
    fi
  done

  if [ -z "$repo_path" ]; then
    echo "[$repo] not found"
    missing=$((missing + 1))
    continue
  fi

  echo "[$repo] installing into $repo_path"

  mkdir -p "$repo_path/.agents" "$repo_path/security/tests" "$repo_path/.github/workflows"

  copy_file "$ROOT_DIR/.agents/site-security-coordinator.md" "$repo_path/.agents/site-security-coordinator.md"
  copy_file "$ROOT_DIR/.agents/site-hardening-agent.md" "$repo_path/.agents/site-hardening-agent.md"
  copy_file "$ROOT_DIR/.agents/site-security-tester.md" "$repo_path/.agents/site-security-tester.md"
  copy_file "$ROOT_DIR/.agents/dependency-ci-security-agent.md" "$repo_path/.agents/dependency-ci-security-agent.md"
  copy_file "$ROOT_DIR/security/static-site-security-check.sh" "$repo_path/security/static-site-security-check.sh"
  copy_file "$ROOT_DIR/security/tests/run-static-site-security-tests.sh" "$repo_path/security/tests/run-static-site-security-tests.sh"
  copy_file "$ROOT_DIR/security/security-report-template.md" "$repo_path/security/security-report-template.md"
  copy_file "$ROOT_DIR/security/site-readme-template.md" "$repo_path/security/site-readme-template.md"
  copy_file "$ROOT_DIR/security/site-security-playbook.md" "$repo_path/security/site-security-playbook.md"
  copy_file "$ROOT_DIR/security/github-actions-security-check.yml" "$repo_path/.github/workflows/security-check.yml"
  copy_file "$ROOT_DIR/security/SECURITY-template.md" "$repo_path/security/SECURITY-template.md"
  copy_file "$ROOT_DIR/security/PENTEST_SCOPE-template.md" "$repo_path/security/PENTEST_SCOPE-template.md"

  chmod +x "$repo_path/security/static-site-security-check.sh"
  chmod +x "$repo_path/security/tests/run-static-site-security-tests.sh"

  if [ ! -f "$repo_path/SECURITY.md" ]; then
    copy_file "$ROOT_DIR/security/SECURITY-template.md" "$repo_path/SECURITY.md"
    echo "[$repo] created SECURITY.md"
  fi

  if [ ! -f "$repo_path/PENTEST_SCOPE.md" ]; then
    copy_file "$ROOT_DIR/security/PENTEST_SCOPE-template.md" "$repo_path/PENTEST_SCOPE.md"
    echo "[$repo] created PENTEST_SCOPE.md"
  fi

  if [ ! -f "$repo_path/README.md" ] && [ -f "$ROOT_DIR/security/site-readmes/${repo}-README.md" ]; then
    copy_file "$ROOT_DIR/security/site-readmes/${repo}-README.md" "$repo_path/README.md"
    echo "[$repo] created README.md"
  fi

  if [ ! -f "$repo_path/.gitignore" ]; then
    {
      echo ".env"
      echo ".env.*"
      echo "!.env.example"
      echo "*.log"
      echo "node_modules/"
      echo "dist/"
      echo "build/"
      echo "security/reports/"
      echo "security/private/"
      echo "*.security-report.txt"
    } >"$repo_path/.gitignore"
    echo "[$repo] created .gitignore"
  elif ! grep -Eq '(^|/)\.env($|[.*[:space:]])' "$repo_path/.gitignore"; then
    {
      echo
      echo "# Security"
      echo ".env"
      echo ".env.*"
      echo "!.env.example"
      echo "security/reports/"
      echo "security/private/"
      echo "*.security-report.txt"
    } >>"$repo_path/.gitignore"
    echo "[$repo] updated .gitignore for .env"
  elif ! grep -Eq '^security/reports/?$' "$repo_path/.gitignore"; then
    {
      echo
      echo "# Local security outputs"
      echo "security/reports/"
      echo "security/private/"
      echo "*.security-report.txt"
    } >>"$repo_path/.gitignore"
    echo "[$repo] updated .gitignore for security reports"
  fi

  installed=$((installed + 1))
  echo "[$repo] done"
  echo
done

echo "Installed: $installed"
echo "Missing: $missing"

if [ "$installed" -eq 0 ]; then
  exit 1
fi

exit 0
