# Aula - Anatomia De Classes

Esta aula explica a estrutura inicial de um programa Java.

Quando você escreve Java, quase tudo fica dentro de uma classe. Por isso, antes de pensar em variáveis, condicionais e loops, é importante entender a "casca" de um programa.

## Programa mínimo

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Java!");
    }
}
```

## `public class Main`

```java
public class Main {
}
```

Isso cria uma classe chamada `Main`.

Por enquanto, pense em classe como uma caixa onde o código Java fica guardado.

Em Java, o nome do arquivo normalmente deve bater com o nome da classe pública.

Exemplo:

```text
Main.java -> public class Main
Aluno.java -> public class Aluno
Produto.java -> public class Produto
```

## `main`

```java
public static void main(String[] args) {
}
```

Esse é o ponto de entrada do programa.

Quando você executa um programa Java, ele procura esse método para saber por onde começar.

Guarde assim:

```text
main = início do programa
```

## `System.out.println`

```java
System.out.println("Olá, Java!");
```

Isso imprime uma mensagem no console.

Comparando com JavaScript:

```js
console.log("Olá, JavaScript!");
```

Em Java:

```java
System.out.println("Olá, Java!");
```

## Letras maiúsculas e minúsculas importam

Java diferencia maiúsculas de minúsculas.

Isto está errado:

```java
system.out.println("Hello World");
```

O correto é:

```java
System.out.println("Hello World");
```

`System` precisa começar com `S` maiúsculo.

## Ponto e vírgula

Em Java, instruções normalmente terminam com `;`.

```java
String nome = "Marcos";
int idade = 25;
System.out.println(nome);
```

Se esquecer o `;`, o Java geralmente mostra erro de compilação.

## Chaves

As chaves `{}` delimitam blocos de código.

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Dentro do main");
    }
}
```

A primeira chave abre a classe.

A segunda chave abre o método `main`.

Depois cada bloco precisa ser fechado.

## Exemplo com variáveis

```java
public class Main {
    public static void main(String[] args) {
        String nome = "Marcos";
        int idade = 25;

        System.out.println("Nome: " + nome);
        System.out.println("Idade: " + idade);
    }
}
```

## O que guardar

- Todo programa Java fica dentro de uma classe.
- O método `main` é onde o programa começa.
- `System.out.println()` imprime no console.
- Java diferencia maiúsculas e minúsculas.
- Em Java, você usa `;` no final das instruções.
- As chaves `{}` organizam os blocos de código.

## Exercício

Crie um arquivo `Main.java` com:

- uma classe `Main`;
- um método `main`;
- uma mensagem no console;
- três variáveis: nome, idade e cidade;
- três `System.out.println()` mostrando esses valores.

