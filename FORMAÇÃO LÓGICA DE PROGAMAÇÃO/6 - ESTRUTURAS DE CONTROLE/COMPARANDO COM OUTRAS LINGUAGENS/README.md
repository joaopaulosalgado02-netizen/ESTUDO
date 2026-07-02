# Comparando Estruturas De Controle Com Outras Linguagens

Estruturas de controle permitem tomar decisões no código usando `if`, `else if` e `else`.

## Java

```java
int idade = 18;

if (idade >= 18) {
    System.out.println("Pode entrar");
} else if (idade >= 16) {
    System.out.println("Pode entrar com responsável");
} else {
    System.out.println("Não pode entrar");
}
```

Java usa parênteses na condição e chaves no bloco.

## C Sharp

```csharp
int idade = 18;

if (idade >= 18) {
    Console.WriteLine("Pode entrar");
} else if (idade >= 16) {
    Console.WriteLine("Pode entrar com responsável");
} else {
    Console.WriteLine("Não pode entrar");
}
```

C# é muito parecido com Java nessa estrutura.

## Python

```python
idade = 18

if idade >= 18:
    print("Pode entrar")
elif idade >= 16:
    print("Pode entrar com responsável")
else:
    print("Não pode entrar")
```

Python usa `elif`, dois pontos e indentação no lugar de chaves.

## PHP

```php
$idade = 18;

if ($idade >= 18) {
    echo "Pode entrar";
} else if ($idade >= 16) {
    echo "Pode entrar com responsável";
} else {
    echo "Não pode entrar";
}
```

PHP tem estrutura parecida com JavaScript, mas usa `$` nas variáveis.
