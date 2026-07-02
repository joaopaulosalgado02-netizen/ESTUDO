# Comparando Switch Case Com Outras Linguagens

O `switch` escolhe um bloco de código conforme o valor de uma variável.

## Java

```java
String dia = "terça";

switch (dia) {
    case "segunda":
        System.out.println("Começo da semana");
        break;
    case "terça":
        System.out.println("Dia de estudar");
        break;
    default:
        System.out.println("Outro dia");
}
```

Java usa `case`, `break` e `default`.

## C Sharp

```csharp
string dia = "terça";

switch (dia) {
    case "segunda":
        Console.WriteLine("Começo da semana");
        break;
    case "terça":
        Console.WriteLine("Dia de estudar");
        break;
    default:
        Console.WriteLine("Outro dia");
        break;
}
```

C# usa uma estrutura muito parecida com Java e JavaScript.

## Python

```python
dia = "terça"

match dia:
    case "segunda":
        print("Começo da semana")
    case "terça":
        print("Dia de estudar")
    case _:
        print("Outro dia")
```

Python moderno usa `match` e `case` para uma ideia parecida com `switch`.

## PHP

```php
$dia = "terça";

switch ($dia) {
    case "segunda":
        echo "Começo da semana";
        break;
    case "terça":
        echo "Dia de estudar";
        break;
    default:
        echo "Outro dia";
}
```

PHP usa `switch`, `case`, `break` e `default`.
