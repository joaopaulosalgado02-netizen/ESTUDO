class Pedido {
    constructor(cliente, produto) {
        this.cliente = cliente;
        this.produto = produto;
    }

    escrever() {
        console.log(`O cliente ${this.cliente} comprou o produto ${this.produto}`)
    }
}

let pedidoMercado = new Pedido("Mariana", "arroz");
let pedidoPapelaria = new Pedido("Carlos", "caderno");

pedidoMercado.escrever();
pedidoPapelaria.escrever();
