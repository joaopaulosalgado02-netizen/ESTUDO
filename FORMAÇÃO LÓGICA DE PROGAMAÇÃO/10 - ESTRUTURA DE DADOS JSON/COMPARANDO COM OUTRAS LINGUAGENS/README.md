# Comparando JSON Com Outras Linguagens

JSON é um formato de dados muito usado para representar objetos, listas e informações de sistemas.

## Java

```java
String json = "{\"nome\":\"João\",\"idade\":30}";
```

Java geralmente usa bibliotecas como Jackson ou Gson para converter JSON em objetos.

## C Sharp

```csharp
string json = "{\"nome\":\"João\",\"idade\":30}";
```

C# pode usar `System.Text.Json` para ler e gerar JSON.

## Python

```python
import json

dados = {"nome": "João", "idade": 30}
texto_json = json.dumps(dados)
```

Python tem o módulo `json` incluído na linguagem.

## PHP

```php
$dados = ["nome" => "João", "idade" => 30];
$textoJson = json_encode($dados);
```

PHP usa `json_encode()` para gerar JSON e `json_decode()` para ler JSON.
