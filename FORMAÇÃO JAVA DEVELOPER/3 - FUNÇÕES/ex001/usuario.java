public class usuario {
    public static void main(String[] args) {
        SmartTV smartTV = new SmartTV();

        System.out.println("A TV está ligada? " + smartTV.ligada);
        System.out.println("Canal atual: " + smartTV.canal);
        System.out.println("Volume atual: " + smartTV.volume);

        smartTV.ligar();
        System.out.println("Novo status - A TV está ligada? " + smartTV.ligada);
    }
}