# CONCREFORT

Site do projeto `CONCREFORT`.

## Desenvolvimento

Abra o projeto localmente e rode os comandos definidos neste repositorio. Se for um site estatico simples, abra o `index.html` no navegador ou use um servidor local.

## Seguranca

Este projeto usa o kit de seguranca de sites em `security/`.

Antes de publicar alteracoes, rode:

```bash
bash security/tests/run-static-site-security-tests.sh
bash security/static-site-security-check.sh .
```

Se o projeto tiver `package-lock.json`, rode tambem:

```bash
npm audit --audit-level=high
```

## Publicacao

Confirme que o site nao inclui:

- arquivos `.env`;
- chaves, tokens ou senhas;
- backups, dumps ou logs;
- relatorios internos de seguranca.

