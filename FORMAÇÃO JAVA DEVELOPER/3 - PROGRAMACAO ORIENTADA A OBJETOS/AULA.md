# Aula - Programacao Orientada A Objetos

Programação Orientada a Objetos, ou POO, é um jeito de organizar programas usando objetos.

Um objeto representa alguma coisa do sistema:

- aluno;
- produto;
- conta bancária;
- cliente;
- pedido;
- personagem.

Cada objeto costuma ter dados e comportamentos.

Exemplo de uma conta bancária:

- dados: titular e saldo;
- comportamentos: depositar, sacar e consultar saldo.

## Classe

Classe é o modelo.

```java
class Pessoa {
    String nome;
    int idade;
}
```

A classe `Pessoa` diz que toda pessoa terá `nome` e `idade`.

## Objeto

Objeto é algo criado a partir de uma classe.

```java
Pessoa pessoa1 = new Pessoa();
pessoa1.nome = "Marcos";
pessoa1.idade = 25;
```

Aqui:

- `Pessoa` é a classe;
- `pessoa1` é o objeto;
- `new Pessoa()` cria o objeto.

## Comparando com JavaScript

Em JavaScript:

```js
const pessoa = {
  nome: "Marcos",
  idade: 25
};
```

Em Java:

```java
class Pessoa {
    String nome;
    int idade;
}

Pessoa pessoa = new Pessoa();
pessoa.nome = "Marcos";
pessoa.idade = 25;
```

Java é mais formal. Primeiro você define o modelo, depois cria objetos.

## Atributos

Atributos são os dados do objeto.

```java
class Aluno {
    String nome;
    int idade;
    double nota;
}
```

`nome`, `idade` e `nota` são atributos.

## Métodos

Métodos são ações do objeto.

```java
class Aluno {
    String nome;
    double nota;

    void apresentar() {
        System.out.println("Olá, meu nome é " + nome);
    }

    boolean aprovado() {
        return nota >= 7;
    }
}
```

`apresentar()` mostra uma mensagem.

`aprovado()` devolve `true` ou `false`.

## New

```java
Aluno aluno = new Aluno();
```

Essa linha significa:

```text
Crie um novo objeto da classe Aluno.
```

`new` cria uma nova instância na memória.

## Construtor

Construtor é um método especial que roda quando o objeto é criado.

Sem construtor:

```java
Aluno aluno = new Aluno();
aluno.nome = "Marcos";
aluno.nota = 8.5;
```

Com construtor:

```java
Aluno aluno = new Aluno("Marcos", 8.5);
```

Classe com construtor:

```java
class Aluno {
    String nome;
    double nota;

    Aluno(String nome, double nota) {
        this.nome = nome;
        this.nota = nota;
    }
}
```

## This

```java
this.nome = nome;
```

`this` significa "este objeto".

No construtor abaixo existem dois `nome`:

```java
class Aluno {
    String nome;

    Aluno(String nome) {
        this.nome = nome;
    }
}
```

- `this.nome`: atributo do objeto;
- `nome`: parâmetro recebido pelo construtor.

Então `this.nome = nome;` significa:

```text
O nome deste objeto recebe o nome que veio como parâmetro.
```

## Encapsulamento

Encapsulamento é proteger os dados do objeto.

Não é ideal deixar atributos abertos assim:

```java
class ContaBancaria {
    double saldo;
}
```

Porque alguém poderia fazer:

```java
conta.saldo = -1000;
```

O correto é proteger:

```java
class ContaBancaria {
    private double saldo;
}
```

Agora o saldo só pode ser alterado por métodos da própria classe.

## Private e public

```java
private String nome;
public void apresentar() {
    System.out.println(nome);
}
```

- `private`: só a própria classe acessa;
- `public`: outras partes do programa podem acessar.

Regra prática:

- atributos normalmente ficam `private`;
- métodos que serão usados de fora ficam `public`.

## Getters e setters

Getter pega um valor.

Setter altera um valor.

```java
class Pessoa {
    private String nome;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
```

Com setter, você pode validar:

```java
public void setNome(String nome) {
    if (nome != null && !nome.isBlank()) {
        this.nome = nome;
    }
}
```

## Exemplo completo

```java
public class Main {
    public static void main(String[] args) {
        Aluno aluno = new Aluno("Marcos", 8.0, 7.5);
        aluno.exibirDados();
    }
}

class Aluno {
    private String nome;
    private double nota1;
    private double nota2;

    Aluno(String nome, double nota1, double nota2) {
        this.nome = nome;
        this.nota1 = nota1;
        this.nota2 = nota2;
    }

    double calcularMedia() {
        return (nota1 + nota2) / 2;
    }

    boolean aprovado() {
        return calcularMedia() >= 7;
    }

    void exibirDados() {
        System.out.println("Aluno: " + nome);
        System.out.println("Média: " + calcularMedia());

        if (aprovado()) {
            System.out.println("Situação: aprovado");
        } else {
            System.out.println("Situação: reprovado");
        }
    }
}
```

## O que guardar

- Classe é o modelo.
- Objeto é criado a partir da classe.
- Atributos são dados.
- Métodos são ações.
- `new` cria um objeto.
- Construtor inicializa o objeto.
- `this` aponta para o próprio objeto.
- `private` protege atributos.
- Encapsulamento evita alterações erradas.

## Exercício

Crie uma classe `Produto` com:

- `nome`;
- `preco`;
- `quantidade`.

Regras:

- os atributos devem ser `private`;
- use construtor;
- crie método `vender(int quantidadeVendida)`;
- crie método `aplicarDesconto(double valor)`;
- crie método `exibirInformacoes()`.
