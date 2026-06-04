let usuario = {
  idade: 18,
};

if (usuario.idade >= 18) {
  console.log("Pode entrar");
} else if (usuario.idade >= 16) {
  console.log("Pode entrar com responsável");
} else {
  console.log("Não pode entrar");
}