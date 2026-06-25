let nomeAluno = "Mariana";
let pontosAluno = 10000;
let nivelAluno; ""

if (pontosAluno <= 1000) {
    console.log("Iniciante");
    nivelAluno = "Iniciante";
} else if (pontosAluno >= 1001 && pontosAluno <= 2000) {
    console.log("Básico");
    nivelAluno = "Básico";
} else if (pontosAluno >= 2001 && pontosAluno <= 5000) {
    console.log("Intermediário");
    nivelAluno = "Intermediário";
} else if (pontosAluno >= 5001 && pontosAluno <= 7000) {
    console.log("Avançado");
    nivelAluno = "Avançado";
} else if (pontosAluno >= 7001 && pontosAluno <= 8000) {
    console.log("Destaque");
    nivelAluno = "Destaque";
} else if (pontosAluno >= 8001 && pontosAluno <= 9000) {
    console.log("Monitor");
    nivelAluno = "Monitor";
} else if (pontosAluno >= 9001 && pontosAluno <= 10000) {
    console.log("Referência");
    nivelAluno = "Referência";
} else {
	nivelAluno = "Especialista";
    console.log("Especialista");
    console.log("O aluno " + nomeAluno + " é um " + nivelAluno + " com " + pontosAluno + " pontos!");
    
}

console.log("O aluno de nome " + nomeAluno + " está no nivel de " + nivelAluno);

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
