# Comparando Operadores De Comparação Com Outras Linguagens

Operadores de comparação verificam se um valor é igual, diferente, maior ou menor que outro.

## Java

```java
int idadeUsuario = 18;
boolean podeEntrar = idadeUsuario >= 18;

String marca = "Apple";
boolean marcaDiferente = !marca.equals("Samsung");
```

Em Java, textos são comparados com `.equals()` em vez de `==`.

## C Sharp

```csharp
int idadeUsuario = 18;
bool podeEntrar = idadeUsuario >= 18;

string marca = "Apple";
bool marcaDiferente = marca != "Samsung";
```

C# permite comparar strings com `==` e `!=`.

## Python

```python
idade_usuario = 18
pode_entrar = idade_usuario >= 18

marca = "Apple"
marca_diferente = marca != "Samsung"
```

Python usa `==`, `!=`, `>`, `<`, `>=` e `<=`.

## PHP

```php
$idadeUsuario = 18;
$podeEntrar = $idadeUsuario >= 18;

$marca = "Apple";
$marcaDiferente = $marca !== "Samsung";
```

PHP tem `==` para comparar valor e `===` para comparar valor e tipo.
