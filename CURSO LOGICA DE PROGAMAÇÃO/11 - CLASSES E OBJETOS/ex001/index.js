class formaDeBolo {
    constructor(saborDaMassa, saborRecheio) {
        this.saborDaMassa = saborDaMassa;
        this.saborRecheio = saborRecheio;
    }

    escrever() {
        console.log(`O sabor da massa é de: ${this.saborDaMassa} 
            de recheio de ${this.saborRecheio}`)
    }
}

let boloFesta = new formaDeBolo("chocolate", 
    "nutella");
let boloPremium = new formaDeBolo("baunilha",
    "morango");

boloFesta.escrever();
boloPremium.escrever();
