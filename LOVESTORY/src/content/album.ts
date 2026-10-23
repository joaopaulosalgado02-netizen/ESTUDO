/** Personalize este arquivo. Textos afetivos são rascunhos, não relatos novos. */
export const album = {
  names: 'Jemima e João', sender: 'João', recipient: 'Jemima', nickname: 'Mima', initials: 'J & J',
  title: 'Um pouco de nós', firstMeeting: '2026-08-28', firstKiss: '2026-09-19',
  counterLabel: 'Desde o nosso primeiro encontro', relationshipStart: null as string | null,
  city: null as string | null,
  music: {
    title: 'Totalmente Seu', artist: 'Marisa Monte', src: null as string | null,
    spotifyUri: 'spotify:track:2WxFuSpORAwJ1XNDeBMSg9',
    spotifyUrl: 'https://open.spotify.com/track/2WxFuSpORAwJ1XNDeBMSg9',
  },
  letter: 'Mima,\n\nGuardei aqui um pouco de nós: os primeiros registros, as caretas, os pequenos cuidados e os dias que merecem ser revisitados.\n\nGosto de pensar que uma fotografia guarda mais do que a gente consegue ver. Que este livro seja um lugar para voltar, sorrir e continuar escrevendo.\n\nCom carinho,\nJoão',
  notes: [
    'Gosto de dividir os pequenos momentos com você.', 'Tem lembrança que cabe numa foto. Outras ficam aqui dentro.',
    'Que a gente encontre mais motivos para sorrir.', 'Um carinho para levar com você hoje.',
    'Ainda há tantas páginas bonitas pela frente.', 'As nossas caretas também merecem um álbum.',
    'Um abraço demorado, mesmo que em forma de bilhete.', 'Gosto deste pedacinho de história que é nosso.',
    'Hoje é um bom dia para criar mais uma lembrança.', 'Mima, este livro foi pensado para você.',
  ],
  letters: [
    { title: 'Bater a saudade', text: 'Abra uma das nossas fotos e fique um pouquinho aqui. Algumas lembranças têm jeito de abraço.' },
    { title: 'O dia pesar', text: 'Faça uma pausa, respire com calma e se trate com carinho. Um dia de cada vez, Mima.' },
    { title: 'Quiser sorrir', text: 'Prescrição de hoje: uma visita à cabine de fotos. As nossas caretas ficaram guardadas justamente para isso.' },
    { title: 'Estivermos longe', text: 'Este é um pedacinho de nós que pode ir com você. Escolha uma lembrança e imagine um abraço demorado.' },
    { title: 'O sono não vier', text: 'Que os pensamentos encontrem um lugar tranquilo. Amanhã a gente continua escrevendo, com calma.' },
    { title: 'Lembrar do começo', text: '28 de agosto. A foto do nosso primeiro encontro está aqui. É bonito poder voltar ao início de uma história.' },
  ],
  dateIdeas: ['Ver um filme', 'Preparar um lanche', 'Um passeio sem pressa', 'Cozinhar juntos', 'Uma tarde de fotos', 'Um piquenique'],
  plans: ['Preparar uma receita a dois', 'Escolher um filme juntos', 'Fazer um piquenique', 'Escrever uma carta à mão'],
  vouchers: ['Um abraço demorado', 'Um lanche à sua escolha', 'Uma noite de filme', 'Uma carta escrita à mão'],
  promises: ['Escutar com atenção.', 'Cuidar dos pequenos gestos.', 'Encontrar tempo para nós.', 'Guardar espaço para as risadas.', 'Continuar escrevendo esta história com carinho.'],
  finalMessage: 'O melhor deste livro é que a nossa história continua fora dele.',
};

export const pages = [
  ['Dedicatória', 'Um livro para nós', 'paper'], ['Sumário', 'Escolha uma lembrança', 'paper'],
  ['Nosso tempo', 'Desde aquele dia', 'paper'], ['Uma carta', 'Palavras guardadas', 'rose'],
  ['Nosso céu', 'Um céu para nós', 'night'], ['Sob a lua', 'Perto, mesmo de longe', 'night'],
  ['Uma flor', 'Uma flor para você', 'rose'], ['Nosso jardim', 'O que a gente cultiva', 'garden'],
  ['Nosso começo', 'Uma notícia bonita', 'news'], ['Primeiras lembranças', 'Onde tudo começou', 'paper'],
  ['Fotografias', 'Pequenos instantes, nós', 'paper'], ['Cabine de fotos', 'Do nosso jeito', 'booth'],
  ['Nosso verbete', 'Um significado só nosso', 'paper'], ['Nossa história', 'Até aqui, com você', 'paper'],
  ['Um encontro', 'Uma ideia para nós dois', 'night'], ['Lanternas', 'Lembranças que iluminam', 'night'],
  ['Bilhetes no pote', 'Um carinho por vez', 'rose'], ['Caixinha de música', 'A trilha desta história', 'wood'],
  ['Abra quando', 'Para outras horas', 'paper'], ['Quebra-cabeça', 'Peça por peça', 'paper'],
  ['Uma surpresa', 'Tem carinho aqui embaixo', 'rose'], ['Pequeno cinema', 'Nossos pequenos vídeos', 'cinema'],
  ['À luz da lanterna', 'Encontre nossas lembranças', 'night'], ['Instantânea', 'Mais uma para guardar', 'paper'],
  ['Nossos lugares', 'Onde a memória fica', 'garden'], ['Próximos planos', 'Ainda há tanto para viver', 'paper'],
  ['Parque a dois', 'Um intervalo para brincar', 'booth'], ['Vales de carinho', 'Escolha um carinho', 'rose'],
  ['Combinados', 'Com carinho, a gente combina', 'paper'], ['Próximo capítulo', 'Esta história continua', 'sunset'],
] as const;

export const chapters = [
  { name: 'As primeiras páginas', detail: 'Dedicatória, tempo e uma carta', from: 0, to: 7 },
  { name: 'O nosso começo', detail: 'Encontro, beijo e fotografias', from: 8, to: 13 },
  { name: 'Pequenos carinhos', detail: 'Luzes, bilhetes e cartas', from: 14, to: 18 },
  { name: 'Lembranças em movimento', detail: 'Jogos, cinema e instantâneas', from: 19, to: 23 },
  { name: 'O que vem pela frente', detail: 'Planos, vales e nosso próximo capítulo', from: 24, to: 29 },
];
