# Site Security Kit

Este kit foi criado para os repositorios de sites:

- `FCEMP`
- `LF`
- `CONCREFORT`

## Rodar nos tres repositorios

Com os repositorios clonados em `/workspaces`, execute a partir de `ESTUDO`:

```bash
bash security/run-target-repo-security.sh /workspaces
```

Os relatorios saem em `security/reports`.

## Instalar o kit nos tres repositorios

```bash
bash security/install-security-kit.sh /workspaces
```

O instalador copia:

- agentes para `.agents`;
- scanner para `security/static-site-security-check.sh`;
- playbook e template de relatorio;
- workflow para `.github/workflows/security-check.yml`;
- entradas basicas de `.gitignore` para proteger `.env`.
- `README.md` especifico do site, quando o repositorio ainda nao tiver um.
- `SECURITY.md` e `PENTEST_SCOPE.md`, quando ainda nao existirem.

## O que nao vai para o GitHub publico

Os relatorios internos gerados pelo runner ficam em `security/reports/` e devem permanecer locais. Eles sao ignorados pelo `.gitignore`, junto com `security/private/` e arquivos `*.security-report.txt`.

## Rodar dentro de um repositorio

```bash
bash security/tests/run-static-site-security-tests.sh
bash security/static-site-security-check.sh .
```

Se houver `package-lock.json`, rode tambem:

```bash
npm audit --audit-level=high
```

## Agentes

- `.agents/site-security-coordinator.md`: coordena a revisao.
- `.agents/site-hardening-agent.md`: aplica correcoes defensivas.
- `.agents/site-security-tester.md`: testa falhas de forma controlada.
- `.agents/dependency-ci-security-agent.md`: cuida de dependencias e CI.

## Arquivos de governanca

- `SECURITY.md`: como reportar vulnerabilidades.
- `PENTEST_SCOPE.md`: quais testes sao permitidos e quando parar.
