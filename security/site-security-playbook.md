# Playbook de Seguranca para Sites

Use este playbook com os agentes em `.agents` para revisar `FCEMP`, `LF` e `CONCREFORT`.

## Preparacao

1. Clonar ou abrir o repositorio alvo.
2. Confirmar que esta no repositorio correto:

```bash
git remote -v
git status --short --branch
```

3. Rodar a varredura estatica:

```bash
bash security/tests/run-static-site-security-tests.sh
bash security/static-site-security-check.sh .
```

Se o script estiver em outro repositorio, chame usando o caminho completo do workspace `ESTUDO`.

Para tentar os tres repositorios por nome quando estiverem clonados como pastas irmas de `ESTUDO`, rode:

```bash
bash /workspaces/ESTUDO/security/run-target-repo-security.sh /workspaces
```

Os relatórios ficam em `/workspaces/ESTUDO/security/reports`.
Esses relatórios sao saidas internas e nao devem ser publicados em repositorios publicos.

Para instalar este kit dentro dos tres repositorios clonados, rode:

```bash
bash /workspaces/ESTUDO/security/install-security-kit.sh /workspaces
```

Se um repositorio alvo nao tiver `README.md`, o instalador cria um README inicial especifico para `FCEMP`, `LF` ou `CONCREFORT`.

## Ordem dos agentes

1. `site-security-coordinator.md`: define escopo e distribui tarefas.
2. `site-hardening-agent.md`: aplica correcoes defensivas.
3. `site-security-tester.md`: tenta reproduzir falhas de forma controlada.
4. `dependency-ci-security-agent.md`: revisa dependencias e CI quando existirem.

## Evidencias obrigatorias por repositorio

Para cada repositorio, registrar:

- commit/branch analisado;
- arquivos HTML, JS e configuracoes revisadas;
- resultado da varredura estatica;
- comandos de build/test/audit executados;
- vulnerabilidades corrigidas;
- riscos que dependem de provedor de hospedagem;
- decisao final: aprovado, aprovado com ressalvas ou bloqueado.

Use `security/security-report-template.md` como modelo para registrar essa evidencia.

## CI recomendado

Para cada repositorio que tiver a pasta `security`, copie `security/github-actions-security-check.yml` para:

```text
.github/workflows/security-check.yml
```

Esse workflow roda a varredura em `push` na `main` e em `pull_request`. Se houver `package-lock.json`, tambem executa `npm audit --audit-level=high`.

## Headers recomendados no deploy

Configurar no provedor de hospedagem sempre que possivel:

```text
Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

A CSP acima e ponto de partida. Ajuste se o site realmente precisar de scripts, imagens, formularios ou APIs externas.
