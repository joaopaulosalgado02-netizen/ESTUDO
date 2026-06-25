// CLASSES COM CONSTRUCTOR

class Produto {
    constructor(nome, preco, quantidade) {
        this.nome = nome;
        this.preco = preco;
        this.quantidade = quantidade;
    }
}

let produto = new Produto("Caderno", 15.90, 3);

console.log("Produto: " + produto.nome);
console.log("Preço: " + produto.preco);
console.log("Quantidade: " + produto.quantidade);
