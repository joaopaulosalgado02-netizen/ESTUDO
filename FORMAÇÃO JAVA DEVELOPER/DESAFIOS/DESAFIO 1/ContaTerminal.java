import java.util.Scanner;

public class ContaTerminal {
    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        System.out.print("Digite o número da conta:");
        String numeroDaConta = scanner.nextLine();

        System.out.print("Digite a agência da conta:");
        String agenciaDaConta = scanner.nextLine();

        System.out.print("Digite o nome do titular da conta:");
        String nomeDoTitular = scanner.nextLine();

        System.out.print("Digite o saldo da conta:");
        double saldo = Double.parseDouble(scanner.nextLine().replace(",", "."));

        String mensagem = "Olá "
        .concat(nomeDoTitular)
        .concat(", obrigado por criar uma conta em nosso banco, sua agência é ")
        .concat(agenciaDaConta) 
        .concat(", conta ")
        .concat(numeroDaConta)
        .concat(String.valueOf(numero))
        .concat(" e seu saldo ")
        .concat(String.valueOf(saldo))
        .concat(" já está disponível para saque.");

        System.out.println(mensagem);

        scanner.close();
    }
}