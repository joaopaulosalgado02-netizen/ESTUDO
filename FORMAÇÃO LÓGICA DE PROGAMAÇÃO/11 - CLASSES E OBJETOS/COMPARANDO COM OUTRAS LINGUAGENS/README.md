# Comparando Classes E Objetos Com Outras Linguagens

Classes servem como modelos. Objetos são valores criados a partir desses modelos.

## Java

```java
class Produto {
    String nome;
    double preco;

    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
}

Produto produto = new Produto("Caderno", 15.90);
```

Java usa `class`, `constructor` com o mesmo nome da classe e `new` para criar objetos.

## C Sharp

```csharp
class Produto {
    public string Nome;
    public double Preco;

    public Produto(string nome, double preco) {
        Nome = nome;
        Preco = preco;
    }
}

Produto produto = new Produto("Caderno", 15.90);
```

C# usa classes parecidas com Java, mas costuma usar nomes de propriedades com letra maiúscula.

## Python

```python
class Produto:
    def __init__(self, nome, preco):
        self.nome = nome
        self.preco = preco

produto = Produto("Caderno", 15.90)
```

Python usa `__init__` como construtor e `self` para acessar atributos do objeto.

## PHP

```php
class Produto {
    public $nome;
    public $preco;

    function __construct($nome, $preco) {
        $this->nome = $nome;
        $this->preco = $preco;
    }
}

$produto = new Produto("Caderno", 15.90);
```

PHP usa `__construct()` e `$this->` para acessar atributos.
