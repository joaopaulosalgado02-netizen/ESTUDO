# Aula Introdutoria - Do JS Para Java

Você já estudou lógica em JavaScript. Isso ajuda muito, porque a lógica principal não muda: variável continua sendo variável, `if` continua sendo decisão, `for` continua sendo repetição, função continua sendo bloco reutilizável.

O que muda é o jeito Java de escrever e organizar.

## O que existe no seu curso de lógica

Na pasta `FORMAÇÃO LÓGICA DE PROGAMAÇÃO`, encontrei estes tópicos:

- variáveis;
- vetores e matrizes;
- operadores aritméticos;
- operadores de comparação;
- operadores lógicos;
- estruturas de controle;
- `switch case`;
- estruturas de repetição;
- funções;
- JSON;
- classes e objetos;
- desafios finais.

Isso é uma base muito boa para Java.

## Tradução mental: JavaScript -> Java

| No JavaScript | No Java | Ideia |
| --- | --- | --- |
| `let nome = "Ana"` | `String nome = "Ana";` | Variável de texto |
| `let idade = 20` | `int idade = 20;` | Variável numérica inteira |
| `let ativo = true` | `boolean ativo = true;` | Verdadeiro ou falso |
| `console.log()` | `System.out.println()` | Mostrar no console |
| `function somar(a, b)` | `int somar(int a, int b)` | Função vira método |
| `array.length` | `array.length` | Tamanho de array |
| `texto.length` | `texto.length()` | Tamanho de texto |
| `===` em texto | `.equals()` em texto | Comparar conteúdo de String |
| objeto literal `{}` | classe + objeto | Modelo mais formal |

## A grande diferença

JavaScript permite isto:

```js
let idade = 20;
idade = "vinte";
```

Java não permite:

```java
int idade = 20;
// idade = "vinte"; // erro
```

Em Java, cada variável tem tipo definido. Isso se chama tipagem estática.

## Comparação de textos

Em JavaScript:

```js
let marca = "Apple";
console.log(marca === "Apple");
```

Em Java:

```java
String marca = "Apple";
System.out.println(marca.equals("Apple"));
```

Em Java, use `.equals()` para comparar o conteúdo de textos.

## Arrays e tamanho

Em JavaScript:

```js
const nomes = ["Ana", "Bruno", "Carlos"];
console.log(nomes.length);
```

Em Java:

```java
String[] nomes = {"Ana", "Bruno", "Carlos"};
System.out.println(nomes.length);
```

Nos dois casos, `length` significa quantidade de itens.

## Funções viram métodos

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

Java exige:

- tipo do retorno: `int`;
- tipo dos parâmetros: `int a`, `int b`;
- método dentro de uma classe.

## Objetos: o ponto mais importante

Em JavaScript, você pode criar um objeto direto:

```js
const aluno = {
  nome: "Marcos",
  nota: 8.5
};
```

Em Java, o caminho normal é criar uma classe:

```java
class Aluno {
    String nome;
    double nota;
}
```

Depois você cria o objeto:

```java
Aluno aluno = new Aluno();
aluno.nome = "Marcos";
aluno.nota = 8.5;
```

Java é mais organizado e mais rígido. Isso é ótimo para projetos grandes.
