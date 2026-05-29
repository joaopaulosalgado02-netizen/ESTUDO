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

