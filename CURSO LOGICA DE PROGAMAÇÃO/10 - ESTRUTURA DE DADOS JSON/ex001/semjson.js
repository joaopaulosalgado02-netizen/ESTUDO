let name = "João"
let age = 30
let products = ["mouse 2x", "teclado", "monitor"]
let productsValues = [50, 100, 500]

generateEnvoice(name, products, productsValues)

function generateEnvoice(name, products, productsValues){
    console.log("O comprador é " + name)
    console.log("O Produto comprado é " + products[0])
    console.log("O valor do produto é " + productsValues[0])
}

