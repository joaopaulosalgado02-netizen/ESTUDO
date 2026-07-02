# Aula - Tipos, Variaveis E Fundamentos Do Java

Java é uma linguagem muito usada em backend, APIs, sistemas de empresas, Android e aplicações grandes.

Como você veio do JavaScript, pense assim: a lógica é parecida, mas Java exige mais organização.

## Estrutura básica

Todo programa Java começa dentro de uma classe.

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Java!");
    }
}
```

Explicando:

- `public class Main`: cria uma classe chamada `Main`;
- `public static void main(String[] args)`: ponto inicial do programa;
- `System.out.println()`: imprime no console.

O equivalente em JavaScript seria algo como:

```js
console.log("Olá, JavaScript!");
```

## Variáveis

Em JavaScript:

```js
let nome = "Marcos";
let idade = 25;
let estudando = true;
```

Em Java:

```java
String nome = "Marcos";
int idade = 25;
boolean estudando = true;
```

Java pede o tipo da variável antes do nome.

## Tipos principais

```java
String texto = "Java";
int numeroInteiro = 10;
double numeroDecimal = 10.5;
boolean verdadeiroOuFalso = true;
char letra = 'A';
```

Use `String` para texto com várias letras.

Use `char` para um único caractere.

```java
String nome = "Ana";
char inicial = 'A';
```

## Constantes

Em JavaScript:

```js
const PAIS = "Brasil";
```

Em Java:

```java
final String PAIS = "Brasil";
```

`final` significa que o valor não pode ser alterado depois.

## Saída no console

```java
System.out.print("Digite seu nome: ");
System.out.println("Olá");
```

Diferença:

- `print`: imprime sem quebrar linha;
- `println`: imprime e quebra linha.

## Entrada de dados com Scanner

Para ler dados digitados pelo usuário, usamos `Scanner`.

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Digite seu nome: ");
        String nome = scanner.nextLine();

        System.out.print("Digite sua idade: ");
        int idade = scanner.nextInt();

        System.out.println("Olá, " + nome + ". Você tem " + idade + " anos.");

        scanner.close();
    }
}
```

Explicando:

- `import java.util.Scanner;`: importa a ferramenta Scanner;
- `new Scanner(System.in)`: cria um leitor do teclado;
- `nextLine()`: lê texto;
- `nextInt()`: lê número inteiro;
- `close()`: fecha o Scanner.

## Operadores aritméticos

```java
int soma = 10 + 5;
int subtracao = 10 - 5;
int multiplicacao = 10 * 5;
int divisao = 10 / 5;
int resto = 10 % 3;
```

O operador `%` pega o resto da divisão.

Exemplo de par ou ímpar:

```java
int numero = 8;

if (numero % 2 == 0) {
    System.out.println("Par");
} else {
    System.out.println("Ímpar");
}
```

## Operadores de comparação

```java
idade >= 18
idade <= 60
idade == 20
idade != 20
idade > 10
idade < 100
```

Para números, `==` compara valor.

Para textos, prefira `.equals()`:

```java
String senha = "1234";

if (senha.equals("1234")) {
    System.out.println("Acesso permitido");
}
```

## Operadores lógicos

```java
&& // e
|| // ou
!  // negação
```

Exemplo:

```java
int idade = 20;
boolean temCarteira = true;

if (idade >= 18 && temCarteira) {
    System.out.println("Pode dirigir");
}
```

## Condicionais

```java
int nota = 75;

if (nota >= 90) {
    System.out.println("Excelente");
} else if (nota >= 70) {
    System.out.println("Aprovado");
} else {
    System.out.println("Reprovado");
}
```

Use `if`, `else if` e `else` quando o programa precisa decidir algo.

## Switch case

```java
String tipo = "Mago";

switch (tipo) {
    case "Mago":
        System.out.println("Atacou usando magia");
        break;
    case "Guerreiro":
        System.out.println("Atacou usando espada");
        break;
    default:
        System.out.println("Tipo desconhecido");
}
```

Use `switch` quando você compara uma variável com vários valores possíveis.

## Repetição com for

```java
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
```

Partes do `for`:

- `int i = 1`: começo;
- `i <= 5`: condição;
- `i++`: atualização.

## Repetição com while

```java
int contador = 1;

while (contador <= 5) {
    System.out.println(contador);
    contador++;
}
```

Use `while` quando a repetição depende de uma condição.

## Arrays

Array guarda vários valores do mesmo tipo.

```java
String[] nomes = {"Ana", "Bruno", "Carlos"};

System.out.println(nomes[0]); // Ana
System.out.println(nomes.length); // 3
```

O primeiro item fica no índice `0`, igual no JavaScript.

Percorrendo com `for`:

```java
for (int i = 0; i < nomes.length; i++) {
    System.out.println(nomes[i]);
}
```

Percorrendo com `for-each`:

```java
for (String nome : nomes) {
    System.out.println(nome);
}
```

## Métodos

Em JavaScript:

```js
function somar(a, b) {
  return a + b;
}
```

Em Java:

```java
public static int somar(int a, int b) {
    return a + b;
}
```

Exemplo completo:

```java
public class Main {
    public static void main(String[] args) {
        int resultado = somar(10, 5);
        System.out.println(resultado);
    }

    public static int somar(int a, int b) {
        return a + b;
    }
}
```

Se o método não retorna nada, use `void`:

```java
public static void mostrarMensagem() {
    System.out.println("Bem-vindo ao Java!");
}
```

## Exercícios

1. Crie variáveis para nome, idade, cidade e se está estudando Java.
2. Leia nome e idade com `Scanner`.
3. Crie um programa que diga se um número é par ou ímpar.
4. Crie um array com 5 nomes e imprima todos.
5. Crie um método `calcularMedia` que recebe duas notas e retorna a média.
