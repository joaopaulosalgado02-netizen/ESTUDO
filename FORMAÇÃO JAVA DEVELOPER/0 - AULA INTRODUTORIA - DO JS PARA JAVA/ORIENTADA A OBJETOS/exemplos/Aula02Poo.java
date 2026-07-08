public class Aula02Poo {
    public static void main(String[] args) {
        Aluno aluno = new Aluno("Marcos", 8.0, 7.5);
        aluno.exibirDados();

        ContaBancaria conta = new ContaBancaria("Marcos");
        conta.depositar(500);
        conta.sacar(150);

        System.out.println("Titular: " + conta.getTitular());
        System.out.println("Saldo: " + conta.getSaldo());
    }
}

class Aluno {
    private String nome;
    private double nota1;
    private double nota2;

    Aluno(String nome, double nota1, double nota2) {
        this.nome = nome;
        this.nota1 = nota1;
        this.nota2 = nota2;
    }

    double calcularMedia() {
        return (nota1 + nota2) / 2;
    }

    boolean aprovado() {
        return calcularMedia() >= 7;
    }

    void exibirDados() {
        System.out.println("Aluno: " + nome);
        System.out.println("Média: " + calcularMedia());

        if (aprovado()) {
            System.out.println("Situação: aprovado");
        } else {
            System.out.println("Situação: reprovado");
        }
    }
}

class ContaBancaria {
    private String titular;
    private double saldo;

    ContaBancaria(String titular) {
        this.titular = titular;
        this.saldo = 0;
    }

    void depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
        }
    }

    void sacar(double valor) {
        if (valor > 0 && valor <= saldo) {
            saldo -= valor;
        }
    }

    String getTitular() {
        return titular;
    }

    double getSaldo() {
        return saldo;
    }
}
