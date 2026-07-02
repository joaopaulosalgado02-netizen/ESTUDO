# Aula Extra - Duvidas Sobre Fundamentos

Este arquivo guarda dúvidas que apareceram durante o estudo.

## O que é `nomes.length`

Imagine este array:

```java
String[] nomes = {"Ana", "Bruno", "Carlos"};
```

`nomes.length` significa:

```text
quantos elementos existem dentro do array nomes
```

Então:

```java
System.out.println(nomes.length);
```

Mostra:

```text
3
```

Os índices são:

```java
nomes[0] // Ana
nomes[1] // Bruno
nomes[2] // Carlos
```

Não existe `nomes[3]`, porque o array tem 3 itens e começa no índice 0.

Por isso usamos:

```java
for (int i = 0; i < nomes.length; i++) {
    System.out.println(nomes[i]);
}
```

O `i < nomes.length` impede que o código tente acessar uma posição que não existe.

## Diferença entre array e String

Array:

```java
String[] nomes = {"Ana", "Bruno"};
System.out.println(nomes.length);
```

Texto:

```java
String nome = "Marcos";
System.out.println(nome.length());
```

Resumo:

- array usa `.length`;
- String usa `.length()`.

## O que é `import java.util.Scanner`

```java
import java.util.Scanner;
```

Essa linha importa a ferramenta `Scanner`.

O `Scanner` serve para ler dados digitados pelo usuário no teclado.

Sem esse import, o Java não reconhece a classe `Scanner`.

## O que é `Scanner scanner = new Scanner(System.in)`

```java
Scanner scanner = new Scanner(System.in);
```

Quebrando:

- `Scanner`: tipo da variável;
- `scanner`: nome da variável;
- `new Scanner(...)`: cria um novo objeto Scanner;
- `System.in`: entrada padrão, ou seja, o teclado.

Em português:

```text
Crie um leitor chamado scanner para ler dados digitados no teclado.
```

## O que é `scanner.nextLine()`

```java
String nome = scanner.nextLine();
```

Lê uma linha inteira de texto.

Se você digitar:

```text
Marcos Melo
```

A variável recebe:

```java
"Marcos Melo"
```

## O que é `scanner.nextInt()`

```java
int idade = scanner.nextInt();
```

Lê um número inteiro.

Se você digitar:

```text
25
```

A variável recebe:

```java
25
```

Se você digitar texto onde o Java espera número, o programa dá erro.

## Diferença entre `print` e `println`

```java
System.out.print("Digite seu nome: ");
```

Imprime sem quebrar linha.

```java
System.out.println("Olá");
```

Imprime e quebra linha depois.

## O que é `scanner.close()`

```java
scanner.close();
```

Fecha o Scanner depois que você terminou de ler dados.

É uma boa prática fechar recursos que você abriu.

## Atenção com `nextInt()` e `nextLine()`

Se você usa `nextInt()` e depois `nextLine()`, pode acontecer de o `nextLine()` pegar uma quebra de linha que ficou pendente.

Exemplo comum:

```java
int idade = scanner.nextInt();
String nome = scanner.nextLine(); // pode ler vazio
```

Solução:

```java
int idade = scanner.nextInt();
scanner.nextLine(); // limpa a quebra de linha
String nome = scanner.nextLine();
```
