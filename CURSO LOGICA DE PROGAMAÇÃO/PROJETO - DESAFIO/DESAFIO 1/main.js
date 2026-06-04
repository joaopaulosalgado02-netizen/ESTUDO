let nomeHeroi = "Meliodas";
let xpHeroi = 10000;
let rankHeroi; ""

if (xpHeroi <= 1000) {
    console.log("Ferro");
    rankHeroi = "Ferro";
} else if (xpHeroi >= 1001 && xpHeroi <= 2000) {
    console.log("Bronze");
    rankHeroi = "Bronze";
} else if (xpHeroi >= 2001 && xpHeroi <= 5000) {
    console.log("Prata");
    rankHeroi = "Prata";
} else if (xpHeroi >= 5001 && xpHeroi <= 7000) {
    console.log("Ouro");
    rankHeroi = "Ouro";
} else if (xpHeroi >= 7001 && xpHeroi <= 8000) {
    console.log("Platina");
    rankHeroi = "Platina";
} else if (xpHeroi >= 8001 && xpHeroi <= 9000) {
    console.log("Ascendente");
    rankHeroi = "Ascendente";
} else if (xpHeroi >= 9001 && xpHeroi <= 10000) {
    console.log("Imortal");
    rankHeroi = "Imortal";
} else {
	rankHeroi = "Radiante";
    console.log("Radiante");
    console.log("O herói " + nomeHeroi + " é um verdadeiro " + rankHeroi + " com " + xpHeroi + " de XP!");
    
}

console.log("O herói de nome " + nomeHeroi + " está no nivel de " + rankHeroi);

// EXEMPLO FUNCIONÁRIO

let nomeFuncionario = "Carlos";
let pontosFuncionario = 10000;
let nivelFuncionario;

if (pontosFuncionario <= 1000) {
    console.log("Júnior");
    nivelFuncionario = "Júnior";
} else if (pontosFuncionario >= 1001 && pontosFuncionario <= 2000) {
    console.log("Assistente");
    nivelFuncionario = "Assistente";
} else if (pontosFuncionario >= 2001 && pontosFuncionario <= 5000) {
    console.log("Pleno");
    nivelFuncionario = "Pleno";
} else if (pontosFuncionario >= 5001 && pontosFuncionario <= 7000) {
    console.log("Sênior");
    nivelFuncionario = "Sênior";
} else if (pontosFuncionario >= 7001 && pontosFuncionario <= 8000) {
    console.log("Especialista");
    nivelFuncionario = "Especialista";
} else if (pontosFuncionario >= 8001 && pontosFuncionario <= 9000) {
    console.log("Coordenador");
    nivelFuncionario = "Coordenador";
} else if (pontosFuncionario >= 9001 && pontosFuncionario <= 10000) {
    console.log("Gerente");
    nivelFuncionario = "Gerente";
} else {
    nivelFuncionario = "Diretor";
    console.log("Diretor");
    console.log("O funcionário " + nomeFuncionario + " é um " + nivelFuncionario + " com " + pontosFuncionario + " pontos!");
}

console.log("O funcionário de nome " + nomeFuncionario + " está no nível de " + nivelFuncionario);

