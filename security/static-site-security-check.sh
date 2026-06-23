#!/usr/bin/env bash
set -u

TARGET="${1:-.}"

if [ ! -d "$TARGET" ]; then
  echo "ERRO: diretorio nao encontrado: $TARGET"
  exit 2
fi

echo "== Static site security check =="
echo "Target: $TARGET"
echo

failures=0
warnings=0

report() {
  severity="$1"
  message="$2"
  echo "[$severity] $message"
  if [ "$severity" = "HIGH" ] || [ "$severity" = "MEDIUM" ]; then
    failures=$((failures + 1))
  else
    warnings=$((warnings + 1))
  fi
}

find_matches() {
  pattern="$1"
  label="$2"
  severity="$3"
  matches="$(find "$TARGET" -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.json' -o -name '*.env' \) -not -path '*/node_modules/*' -not -path '*/.git/*' -exec grep -nEi "$pattern" {} + 2>/dev/null || true)"
  if [ -n "$matches" ]; then
    report "$severity" "$label"
    echo "$matches"
    echo
  fi
}

find_matches 'AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|secret|password|passwd|token|api[_-]?key' 'Possivel segredo ou credencial em arquivo versionavel.' HIGH
find_matches 'http://' 'Recurso ou link usando http://. Prefira https://.' MEDIUM
find_matches 'innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|new Function\(' 'API perigosa para XSS encontrada. Revisar origem dos dados.' HIGH
find_matches 'onerror=|onload=|onclick=|onmouseover=|javascript:' 'Handler inline ou javascript: encontrado. Reduzir risco de XSS.' MEDIUM
find_matches 'console\.log\(|console\.debug\(' 'Logs no console encontrados. Verificar se nao expoem dados sensiveis.' LOW
find_matches '\.map(["'\'') ]|sourceMappingURL=' 'Source maps referenciados. Confirme se devem ir para producao.' LOW

blank_without_rel=""
while IFS= read -r html_file; do
  while IFS= read -r line; do
    line_number="${line%%:*}"
    line_text="${line#*:}"
    if ! printf '%s\n' "$line_text" | grep -Eiq 'rel=["'\''][^"'\'']*(noopener|noreferrer)[^"'\'']*["'\'']'; then
      blank_without_rel="${blank_without_rel}${html_file}:${line_number}:${line_text}
"
    fi
  done < <(grep -nEi 'target=["'\'']_blank["'\'']' "$html_file" 2>/dev/null || true)
done < <(find "$TARGET" -type f -name '*.html' -not -path '*/node_modules/*' -not -path '*/.git/*' -print 2>/dev/null)

if [ -n "$blank_without_rel" ]; then
  report MEDIUM 'Links target=_blank sem rel="noopener noreferrer".'
  printf '%s' "$blank_without_rel"
  echo
fi

forms_without_action=""
while IFS= read -r html_file; do
  while IFS= read -r line; do
    line_number="${line%%:*}"
    line_text="${line#*:}"
    if ! printf '%s\n' "$line_text" | grep -Eiq 'action=["'\''][^"'\'']+["'\'']'; then
      forms_without_action="${forms_without_action}${html_file}:${line_number}:${line_text}
"
    fi
  done < <(grep -nEi '<form([ >]|$)' "$html_file" 2>/dev/null || true)
done < <(find "$TARGET" -type f -name '*.html' -not -path '*/node_modules/*' -not -path '*/.git/*' -print 2>/dev/null)

if [ -n "$forms_without_action" ]; then
  report LOW 'Formulario sem action explicito. Confirme comportamento e validacao.'
  printf '%s' "$forms_without_action"
  echo
fi

env_files="$(find "$TARGET" -type f \( -name '.env' -o -name '*.pem' -o -name '*.key' -o -name '*.p12' -o -name '*.sql' -o -name '*.sqlite' -o -name '*.zip' \) -not -path '*/node_modules/*' -not -path '*/.git/*' -print 2>/dev/null || true)"
if [ -n "$env_files" ]; then
  report HIGH 'Arquivos sensiveis ou backups encontrados no repositorio.'
  echo "$env_files"
  echo
fi

missing_viewport=""
while IFS= read -r html_file; do
  if ! grep -Eiq '<meta[^>]*name=["'\'']viewport["'\'']' "$html_file"; then
    missing_viewport="${missing_viewport}${html_file}
"
  fi
done < <(find "$TARGET" -type f -name '*.html' -not -path '*/node_modules/*' -not -path '*/.git/*' -print 2>/dev/null)

if [ -n "$missing_viewport" ]; then
  report LOW 'HTML sem meta viewport.'
  printf '%s' "$missing_viewport"
  echo
fi

if [ -d "$TARGET/.git" ] && [ ! -f "$TARGET/.gitignore" ]; then
  report LOW 'Repositorio sem .gitignore. Recomenda-se ignorar .env, logs, caches e builds locais.'
  echo
fi

if [ -f "$TARGET/.gitignore" ]; then
  if ! grep -Eq '(^|/)\.env($|[.*[:space:]])' "$TARGET/.gitignore"; then
    report LOW '.gitignore nao parece cobrir arquivos .env.'
    echo "$TARGET/.gitignore"
    echo
  fi
fi

if [ -f "$TARGET/package.json" ]; then
  echo "[INFO] package.json encontrado."
  if [ -f "$TARGET/package-lock.json" ] || [ -f "$TARGET/npm-shrinkwrap.json" ]; then
    echo "[INFO] Lockfile npm encontrado."
  elif [ -f "$TARGET/yarn.lock" ] || [ -f "$TARGET/pnpm-lock.yaml" ]; then
    echo "[INFO] Lockfile de outro gerenciador encontrado."
  else
    report MEDIUM 'package.json sem lockfile npm. Builds ficam menos reprodutiveis.'
  fi
  echo
fi

echo "== Resultado =="
if [ "$failures" -gt 0 ]; then
  echo "Encontrados $failures pontos HIGH/MEDIUM e $warnings pontos LOW/INFO para revisar."
  exit 1
fi

echo "Nenhum ponto HIGH/MEDIUM encontrado pela varredura estatica basica. Pontos LOW/INFO: $warnings."
exit 0
