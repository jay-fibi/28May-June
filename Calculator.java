import java.util.Scanner;

public class Calculator {

    public static double add(double a, double b) {
        return a + b;
    }

    public static double subtract(double a, double b) {
        return a - b;
    }

    public static double multiply(double a, double b) {
        return a * b;
    }

    public static double divide(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("Cannot divide by zero");
        }
        return a / b;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        System.out.println("=== Simple Calculator ===");

        while (running) {
            System.out.println();
            System.out.println("1. Add");
            System.out.println("2. Subtract");
            System.out.println("3. Multiply");
            System.out.println("4. Divide");
            System.out.println("5. Exit");
            System.out.print("Choose an option: ");

            String choice = scanner.next();

            if (choice.equals("5")) {
                System.out.println("Goodbye!");
                running = false;
                continue;
            }

            if (!choice.matches("[1-4]")) {
                System.out.println("Invalid option. Please choose 1-5.");
                continue;
            }

            double num1;
            double num2;
            try {
                System.out.print("Enter first number: ");
                num1 = Double.parseDouble(scanner.next());
                System.out.print("Enter second number: ");
                num2 = Double.parseDouble(scanner.next());
            } catch (NumberFormatException e) {
                System.out.println("Invalid number. Please try again.");
                continue;
            }

            try {
                switch (choice) {
                    case "1":
                        System.out.println("Result: " + num1 + " + " + num2 + " = " + add(num1, num2));
                        break;
                    case "2":
                        System.out.println("Result: " + num1 + " - " + num2 + " = " + subtract(num1, num2));
                        break;
                    case "3":
                        System.out.println("Result: " + num1 + " * " + num2 + " = " + multiply(num1, num2));
                        break;
                    case "4":
                        System.out.println("Result: " + num1 + " / " + num2 + " = " + divide(num1, num2));
                        break;
                }
            } catch (ArithmeticException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }

        scanner.close();
    }
}
