function calcularNivel(atividadesConcluidas, atividadesPendentes){
    let saldoAtividades = atividadesConcluidas - atividadesPendentes;
    nivel


    if (atividadesConcluidas <= 10) {
        console.log("Iniciante");
        nivel = "Iniciante";
    } else if (atividadesConcluidas >= 11 && atividadesConcluidas <= 20) {
        console.log("Básico");
        nivel = "Básico";
    } else if (atividadesConcluidas >= 21 && atividadesConcluidas <= 50) {
        console.log("Intermediário");
        nivel = "Intermediário";
    } else if (atividadesConcluidas >= 51 && atividadesConcluidas <= 80) {
        console.log("Avançado");
        nivel = "Avançado";
    } else if (atividadesConcluidas >= 81 && atividadesConcluidas <= 90) {
        console.log("Destaque");
        nivel = "Destaque";
    } else if (atividadesConcluidas >= 91 && atividadesConcluidas <= 100) {
        console.log("Referência");
        nivel = "Referência";
    } else if (atividadesConcluidas >= 101) {
        console.log("Especialista");
        nivel = "Especialista";
    }

    return { saldoAtividades, nivel}

}

let atividadesConcluidas = 70
let atividadesPendentes = 22
let nivel = ""

let resultado = calcularNivel(atividadesConcluidas, atividadesPendentes)


console.log("A pessoa concluiu " + atividadesConcluidas + " atividades e está no nivel de " + nivel);
