# Comparando Estruturas De Repetição Com Outras Linguagens

Estruturas de repetição executam o mesmo bloco várias vezes. Exemplos comuns são `for`, `while` e `do while`.

## Java

```java
for (int i = 1; i <= 3; i++) {
    System.out.println("Tarefa " + i);
}

int contador = 0;
while (contador < 3) {
    contador++;
}
```

Java usa `for` e `while` de forma parecida com JavaScript.

## C Sharp

```csharp
for (int i = 1; i <= 3; i++) {
    Console.WriteLine("Tarefa " + i);
}

int contador = 0;
while (contador < 3) {
    contador++;
}
```

C# também usa `for`, `while` e `do while`.

## Python

```python
for i in range(1, 4):
    print("Tarefa", i)

contador = 0
while contador < 3:
    contador += 1
```

Python usa `range()` para repetir com números.

## PHP

```php
for ($i = 1; $i <= 3; $i++) {
    echo "Tarefa " . $i;
}

$contador = 0;
while ($contador < 3) {
    $contador++;
}
```

PHP usa `.` para concatenar texto com variável.
