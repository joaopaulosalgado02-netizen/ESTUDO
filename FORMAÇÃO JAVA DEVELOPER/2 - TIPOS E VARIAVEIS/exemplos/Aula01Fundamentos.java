import java.util.Scanner;

public class Aula01Fundamentos {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Digite seu nome: ");
        String nome = scanner.nextLine();

        System.out.print("Digite sua idade: ");
        int idade = scanner.nextInt();

        System.out.print("Digite sua primeira nota: ");
        double nota1 = scanner.nextDouble();

        System.out.print("Digite sua segunda nota: ");
        double nota2 = scanner.nextDouble();

        double media = calcularMedia(nota1, nota2);

        System.out.println("Aluno: " + nome);
        System.out.println("Idade: " + idade);
        System.out.println("Média: " + media);

        if (media >= 7) {
            System.out.println("Situação: aprovado");
        } else {
            System.out.println("Situação: reprovado");
        }

        String[] nomes = {"Ana", "Bruno", "Carlos"};

        System.out.println("Quantidade de nomes: " + nomes.length);

        for (String item : nomes) {
            System.out.println("Nome cadastrado: " + item);
        }

        scanner.close();
    }

    public static double calcularMedia(double nota1, double nota2) {
        return (nota1 + nota2) / 2;
    }
}
