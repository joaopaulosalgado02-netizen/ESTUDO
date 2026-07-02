let invoice = {
    name: "João",
    age: 30,
    products: {
        0: ["mouse 2x", 50],
        1: ["teclado", 100],
        2: ["monitor", 500],
        3: ["cabo hdmi", 20],
        4: ["cabo vga", 15],
        5: ["cabo usb", 10],
        6: ["cabo de rede", 25],
        7: ["cabo de energia", 30],
        8: ["cabo de áudio", 25],
        9: ["cabo de vídeo", 30]
    }
}

generateEnvoice(invoice)

function generateEnvoice(invoice){
    console.log(`O comprador é ${invoice.name}`)
    console.log(`A idade do comprador é ${invoice.age}`)

    console.log("------------------------------")

    for (let index in invoice.products){
        let [productName, productValue] = invoice.products[index]
        
        console.log(`O Produto comprado é ${productName}`)
        console.log(`O valor do produto é ${productValue}`)
    }
}
