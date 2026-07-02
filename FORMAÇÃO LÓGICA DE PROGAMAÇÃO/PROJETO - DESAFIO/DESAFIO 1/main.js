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