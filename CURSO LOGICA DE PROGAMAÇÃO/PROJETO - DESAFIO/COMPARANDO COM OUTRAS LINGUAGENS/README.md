# Comparando Projetos De Desafio Com Outras Linguagens

Nos desafios, a lógica principal é receber valores, comparar faixas e retornar uma classificação.

## Java

```java
static String calcularNivel(int pontos) {
    if (pontos <= 1000) {
        return "Iniciante";
    } else if (pontos <= 5000) {
        return "Intermediário";
    }
    return "Avançado";
}
```

Java costuma separar a lógica em métodos com tipo de retorno definido.

## C Sharp

```csharp
static string CalcularNivel(int pontos) {
    if (pontos <= 1000) {
        return "Iniciante";
    } else if (pontos <= 5000) {
        return "Intermediário";
    }
    return "Avançado";
}
```

C# é parecido com Java, mas segue convenções como nome de método iniciando com maiúscula.

## Python

```python
def calcular_nivel(pontos):
    if pontos <= 1000:
        return "Iniciante"
    elif pontos <= 5000:
        return "Intermediário"
    return "Avançado"
```

Python deixa a função mais curta por causa da indentação e da tipagem dinâmica.

## PHP

```php
function calcularNivel($pontos) {
    if ($pontos <= 1000) {
        return "Iniciante";
    } else if ($pontos <= 5000) {
        return "Intermediário";
    }
    return "Avançado";
}
```

PHP mantém uma estrutura bem próxima da lógica vista em JavaScript.
