// CLASSES E OBJETOS

class Cliente {
    nome;
    idade;
    email;
}

let cliente = new Cliente();
cliente.nome = "Mariana";
cliente.idade = 28;
cliente.email = "mariana@email.com";

console.log("Cliente: " + cliente.nome);
console.log("Idade: " + cliente.idade);
console.log("Email: " + cliente.email);
