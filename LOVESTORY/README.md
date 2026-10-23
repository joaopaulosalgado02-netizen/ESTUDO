# LOVESTORY · Um pouco de nós

Álbum de Jemima e João feito para o navegador do celular. Inclui capa com abertura animada, 30 páginas, 18 fotografias e os dois vídeos completos do material fornecido.

## Executar

Requer Node.js 22.12+ ou 24 LTS e npm.

```powershell
cd E:\Desenvolvimento\LOVESTORY
npm.cmd install
npm.cmd run dev -- --port 5177
```

Abra `http://localhost:5177` no computador. Para conferir no celular, conecte ambos à mesma rede Wi-Fi e use o endereço **Network** que o Vite imprime, como `http://IP-DO-COMPUTADOR:5177`. O comando já permite conexões pela rede local; o firewall do sistema precisa permitir esse acesso. O endereço local só funciona enquanto o servidor está aberto.

```powershell
npm.cmd run build
npm.cmd run preview -- --port 4177
```

O build fica em `dist/`. Não há backend, login, serviço pago ou dependência de fontes externas. A aplicação usa React, TypeScript, Vite, CSS e desenhos SVG próprios. É um álbum web responsivo; não foi gerado um APK ou um aplicativo nativo.

## Personalizar

- `src/content/album.ts`: nomes, datas, carta, bilhetes, seis cartas, ideias de encontros, planos, vales, combinados e mensagem final.
- `src/content/media.json`: registro das 20 mídias, dimensões, orientação e dados de procedência.
- `src/content/photo-story.ts`: legendas, linha do tempo e um papel principal exclusivo para cada uma das 18 fotos.
- `src/components/Photo.tsx`: fotografias responsivas e estados de carregamento.
- `src/styles.css` e `src/styles/`: materiais, composições e transições.

Os textos afetivos, planos e combinados são **rascunhos editáveis**, preparados sem acrescentar acontecimentos à história. Convém revisar a carta e as frases para ficarem com o seu jeito de falar. As ideias de planos aparecem como sugestões, não como fatos já vividos.

O contador usa **28/08/2026**, desde o primeiro encontro. O primeiro beijo está associado a **19/09/2026**, e as máscaras a **10/10/2026**. O ano foi adotado a partir do contexto do kit. O cálculo usa datas de calendário em `America/Sao_Paulo`, sem atribuir horário ao encontro. A data de início do namoro permanece independente e vazia. Datas e locais pendentes não são deduzidos dos nomes dos arquivos.

### Música

A canção foi confirmada como **Totalmente Seu, da Marisa Monte**, versão do álbum *Portas*. A faixa está configurada em `album.ts` com o [link oficial do Spotify](https://open.spotify.com/track/2WxFuSpORAwJ1XNDeBMSg9). Nenhum MP3 foi baixado ou redistribuído.

Ao abrir a caixinha ou tocar no controle de música do cabeçalho, o álbum carrega o player oficial do Spotify. O player permanece montado ao folhear, pausa para os vídeos e só retoma se estava tocando antes. A API é carregada apenas após esse gesto. Há um link para abrir a faixa no Spotify e um estado alternativo quando a conexão bloqueia o player.

O navegador ou o Spotify podem exigir outro toque no play, restringir a reprodução ou oferecer uma prévia. O álbum não presume reprodução completa nem marca a música como tocando antes de receber confirmação do player. A integração usa a [API oficial de iframe](https://developer.spotify.com/documentation/embeds/references/iframe-api), sem credenciais da conta no código.

Se preferir usar futuramente um arquivo de áudio que possa incluir, coloque-o em `public/audio/` e altere somente os campos correspondentes em `album.ts`, preservando os campos Spotify:

```ts
music: {
  title: 'Totalmente Seu',
  artist: 'Marisa Monte',
  src: `${import.meta.env.BASE_URL}audio/totalmente-seu.mp3`,
},
```

Com `src` preenchido, o controle usa o arquivo local e acrescenta volume; com `src: null`, usa o Spotify. Os controles do Spotify permanecem próprios do serviço.

### Acrescentar lembranças

Coloque a nova mídia em `public/media/`, acrescente o registro em `src/content/media.json` seguindo o formato existente e adicione uma legenda em `Photo.tsx`. As fotos com `type: 'image'` e um `label` único passam a integrar a galeria. Para uma lembrança em cena específica, ajuste o respectivo componente em `src/components/scenes/` e confira os textos de contagem caso altere a quantidade.

## Funcionamento no celular

Até 1049 px, o livro mostra uma página por vez. A partir de 1050 px, mostra duas páginas. Conteúdos longos têm rolagem dentro da folha; a navegação permanece acessível. É possível usar anterior/próxima, sumário, setas do teclado e gesto horizontal fora dos objetos interativos.

O sumário dá acesso direto à carta, ao começo, à galeria e aos vídeos, além de todas as 30 páginas agrupadas por capítulo. As fotos ampliadas preservam o enquadramento inteiro. A F03 recebe rotação visual de −90°, sem modificar o arquivo.

As interações incluem jardim de três plantas, envelopes, jornal, fotos que viram, cabine, roda de encontros, lanternas, dez bilhetes sem repetição antes do fim da lista, caixinha, seis cartas, quebra-cabeça por toque ou arraste, raspadinha com botão alternativo, dois vídeos, lanterna, câmera de lembranças, planos, dois jogos, vales e assinatura desenhada ou digitada. Os vales são simbólicos; cada um custa três pontos obtidos nos jogos.

As transições mantêm continuidade espacial: o papel sobe do envelope e retorna ao fechar; o bilhete sai do pote e se desdobra; o medalhão articula a tampa; o jornal dobra; a câmera recolhe e ejeta a foto no replay; a raspadinha dissolve sua cobertura; as peças se deslocam entre posições. O sumário termina de sair antes da virada, e fechar o livro tem uma transição própria. A galeria preserva a foto anterior até a próxima estar decodificada. Tudo respeita movimento reduzido.

A virada usa uma cópia visual temporária da folha, inclusive seu desenho em canvas e a posição da rolagem. Essa cópia é inerte e não remonta cenas, listeners, timers ou jogos. Só as páginas visíveis ficam ativas; os grupos seguintes são carregados conforme necessário.

## Progresso

A chave `lovestory.jemima-joao.v1` guarda a página atual, bilhetes, jardim, cartas abertas, peças do quebra-cabeça, planos, pontos, vales e assinatura no `localStorage` deste navegador. Isso **não sincroniza entre aparelhos ou pessoas**. Navegação privada, limpeza de dados e restrições do navegador podem impedir a persistência; o álbum continua funcionando em memória.

O pequeno botão de reiniciar no rodapé pede confirmação antes de limpar os estados. A assinatura e os vales não são enviados a ninguém.

## Mídias e material de referência

`reference/Kit_Album_Romantico/` preserva o conteúdo extraído do ZIP, inclusive os documentos de planejamento. Esses documentos foram tratados como material de referência para este projeto.

`public/media/` contém cópias dos originais e dos aliases JPEG recebidos. Arquivos que tinham extensão HEIC ou WebP mas conteúdo JPEG usam os aliases `.jpg` do próprio kit. Não houve retoque de rostos, filtros, fundos ou cores, nem substituição por fotos geradas.

As derivações incluem `public/media/posters/1.jpg` e `2.jpg`, quadros reais extraídos em 0,15 segundo de cada vídeo, e 62 JPEGs responsivos em `public/media/optimized/` nas larguras 96/320/640/960 quando menores que o original. Os vídeos e fotografias recebidos permanecem intactos. `scripts/optimize-media.ps1` reproduz o redimensionamento determinístico em Windows/System.Drawing; não é necessário executá-lo para rodar ou compilar. `scripts/capture-preview.mjs` reproduz os posters com um Chromium local. As capturas ficam em `.qa/`, ignorada pelo Git.

A [demonstração pública da LovePanda](https://lovepanda.com.br/presente/edu-ana-43e26386) foi aberta no Chromium e observada em quadros progressivos, incluindo a abertura do livro e o recolhimento, captura e alimentação das tiras da cabine. A referência serviu para estudar o movimento dos objetos; composição, ilustrações e código deste álbum são próprios. As capturas de pesquisa ficam apenas em `.qa/lovepanda/`, fora do build.

A capa gira pela lombada com frente e verso em perspectiva 3D. A página real já está montada durante a abertura e mantém a identidade ao final: uma cópia visual inerte acompanha o movimento até ocupar exatamente seu retângulo. No fechamento, a sequência faz o caminho inverso até a posição da capa sobre a mesa. Fotografias da página são carregadas antes de congelar sua face. A cabine mantém a tira inteira no DOM, oculta dentro da máquina, e a alimenta pela fenda em 2,6 segundos; imprimir novamente recolhe o papel primeiro. O pote levanta a tampa, extrai um único bilhete pela boca, faz seu percurso e o desdobra antes de mostrar a escrita.

## Verificação

```powershell
npm.cmd test
npm.cmd run build
# Em outro terminal, mantenha npm.cmd run dev -- --port 5177 aberto:
npm.cmd run test:browser
npm.cmd run test:motion
npm.cmd run test:physical
npm.cmd run test:music
```

O teste de navegador usa `playwright-core` com Chrome ou Edge já instalado; não baixa um navegador. É possível configurar `BROWSER_PATH` para outro Chromium e `ALBUM_URL` para conferir outro servidor. O relatório é salvo em `.qa/browser-report.json`.

Foram conferidos os fluxos no Chromium e os tamanhos 360 × 800, 390 × 844, 768 × 1024, 1440 × 900 e 360 × 640: acesso às 30 páginas, enquadramento da galeria, ausência de overflow horizontal, interações, reprodução/pausa/fechamento dos dois vídeos, persistência, reinício, navegação por teclado, foco dos modais e movimento reduzido. Os testes de calendário cobrem a mudança de dia no Brasil, meses de tamanhos diferentes e ano bissexto. A compilação TypeScript e o build de produção também foram executados.

O teste `test:motion` amostra posições e opacidades a cada frame em 390 × 844, 360 × 640 e 1440 × 900, nos modos normal e reduzido. Ele verifica movimento real de entrada/saída, foco, sequência sumário→virada e ausência de quadros vazios na galeria sob atraso de rede.

`test:physical` verifica também a dobradiça em 3D com capa e página presentes ao mesmo tempo, a identidade da página ao longo da abertura, o encaixe geométrico no final, a foto carregada e legível na cópia, a saída progressiva da tira sem fade e a ordem tampa→extração→descida do bilhete. Registra quadros e medições em `.qa/physical/`. O recolhimento e a repetição dos objetos também são exercitados.

`test:music` usa um substituto explícito da API oficial para verificar faixa, comandos, continuidade ao navegar, pausa no cinema e retomada condicional. Esse teste não comprova streaming audível. Uma conferência separada com acesso à rede carregou a API e o player oficiais com HTTP 200 e mostrou **Totalmente Seu — Marisa Monte**; o Spotify ofereceu uma prévia nesse navegador. A captura está em `.qa/music-spotify-mobile.png`. O estado alternativo e o link direto foram mantidos para conexões que bloqueiem o serviço.

A conferência foi feita em navegador de desktop com viewports móveis. Ainda cabe validar em um aparelho físico Android/iPhone, especialmente Safari, reprodução externa do Spotify, tela cheia dos vídeos e gestos do sistema.

## Publicar depois

Nenhuma publicação foi realizada. Para compartilhar por um link permanente, gere `dist/` e escolha uma hospedagem estática. A pasta `reference/` não precisa ser enviada.

Como o build contém as fotos e os vídeos, escolha o controle de acesso da hospedagem antes de enviá-lo. Um link difícil de adivinhar ou uma senha só no JavaScript não restringem o acesso aos arquivos. Um álbum com acesso realmente privado depende da proteção oferecida pelo servidor ou pela hospedagem escolhida.
