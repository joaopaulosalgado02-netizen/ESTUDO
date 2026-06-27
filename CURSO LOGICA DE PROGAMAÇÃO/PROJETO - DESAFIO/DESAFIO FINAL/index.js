class Personagem {
    constructor(nome, tipo) {
        this.nome = nome;
        this.tipo = tipo;
    }

    atacar() {
        let ataque;

        switch (this.tipo) {
            case "Mago":
                ataque = "magia";
                break;
            case "Guerreiro":
                ataque = "espada";
                break;
            case "Monge":
                ataque = "artes marciais";
                break;
            case "Ninja":
                ataque = "shuriken";
                break;
        }

        console.log(`O ${this.tipo} atacou usando ${ataque}`);
    }
}

let heroi = new Personagem("Meliodas", "Mago");

heroi.atacar();