# Repositorios Alvo

Estes sao os repositorios de sites citados para o trabalho de seguranca:

- `FCEMP`
- `LF`
- `CONCREFORT`

## Status de acesso nesta sessao

O workspace atual e `ESTUDO`, com remoto `joaopaulosalgado02-netizen/ESTUDO`.
Os repositorios `FCEMP`, `LF` e `CONCREFORT` nao estao clonados aqui.

A tentativa de acessar:

- `https://github.com/joaopaulosalgado02-netizen/FCEMP.git`
- `https://github.com/joaopaulosalgado02-netizen/LF.git`
- `https://github.com/joaopaulosalgado02-netizen/CONCREFORT.git`

retornou `403` com o token GitHub atual. Uma segunda tentativa sem `GITHUB_TOKEN` nao conseguiu continuar porque o Git pediu usuario em modo nao interativo.

Quando o acesso estiver corrigido ou os repositorios forem clonados neste workspace, execute o playbook em `security/site-security-playbook.md`.

Para copiar os agentes, scanner e workflow para os repositorios clonados, use:

```bash
bash security/install-security-kit.sh /workspaces
```
