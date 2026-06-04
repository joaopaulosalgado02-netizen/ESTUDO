function calcularRank(vitorias, derrotas){
    let saldoVitorias = vitorias - derrotas;
    rank


    if (vitorias <= 10) {
        console.log("Ferro");
        rank = "Ferro";
    } else if (vitorias >= 11 && vitorias <= 20) {
        console.log("Bronze");
        rank = "Bronze";
    } else if (vitorias >= 21 && vitorias <= 50) {
        console.log("Prata");
        rank = "Prata";
    } else if (vitorias >= 51 && vitorias <= 80) {
        console.log("Ouro");
        rank = "Ouro";
    } else if (vitorias >= 81 && vitorias <= 90) {
        console.log("Diamante");
        rank = "Diamante";
    } else if (vitorias >= 91 && vitorias <= 100) {
        console.log("Lendário");
        rank = "Lendário";
    } else if (vitorias >= 101) {
        console.log("Imortal");
        rank = "Imortal";
    }

    return { saldoVitorias, rank}

}

let vitorias = 70
let derrotas = 22
let rank = ""

let resultado = calcularRank(vitorias, derrotas)


console.log("O héroi tem de " + vitorias + " está no nivel de " + rank);