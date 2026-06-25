# Comparando Funções Com Outras Linguagens

Funções agrupam comandos para serem chamados quando necessário.

## Java

```java
static void dizerOla(String nome) {
    System.out.println("Olá, " + nome);
}

dizerOla("Mariana");
```

Em Java, funções normalmente ficam dentro de uma classe e informam o tipo do retorno.

## C Sharp

```csharp
static void DizerOla(string nome) {
    Console.WriteLine("Olá, " + nome);
}

DizerOla("Mariana");
```

C# também costuma declarar o tipo do retorno, como `void` quando não retorna nada.

## Python

```python
def dizer_ola(nome):
    print("Olá, " + nome)

dizer_ola("Mariana")
```

Python usa `def` para criar funções.

## PHP

```php
function dizerOla($nome) {
    echo "Olá, " . $nome;
}

dizerOla("Mariana");
```

PHP usa `function` como JavaScript, mas com `$` nos parâmetros.
