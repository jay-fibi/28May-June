import java.util.Scanner;

/**
 * A simple console-based calculator that supports basic arithmetic operations:
 * addition, subtraction, multiplication, division, modulus, power, square root,
 * percentage, and absolute value.
 *
 * Usage: javac Calculator.java && java Calculator
 */
public class Calculator {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean keepRunning = true;

        System.out.println("=================================");
        System.out.println("       Java Calculator");
        System.out.println("=================================");

        while (keepRunning) {
            printMenu();
            String choice = scanner.nextLine().trim();

            switch (choice) {
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "8":
                    performOperation(scanner, choice);
                    break;
                case "7":
                case "9":
                    performUnaryOperation(scanner, choice);
                    break;
                case "10":
                    keepRunning = false;
                    System.out.println("Goodbye!");
                    break;
                default:
                    System.out.println("Invalid choice. Please select 1-10.");
            }
        }

        scanner.close();
    }

    private static void printMenu() {
        System.out.println();
        System.out.println("Choose an operation:");
        System.out.println("  1. Addition (+)");
        System.out.println("  2. Subtraction (-)");
        System.out.println("  3. Multiplication (*)");
        System.out.println("  4. Division (/)");
        System.out.println("  5. Modulus (%)");
        System.out.println("  6. Power (x^y)");
        System.out.println("  7. Square Root (sqrt x)");
        System.out.println("  8. Percentage (x% of y)");
        System.out.println("  9. Absolute Value (|x|)");
        System.out.println(" 10. Exit");
        System.out.print("Enter your choice: ");
    }

    private static void performOperation(Scanner scanner, String choice) {
        double a = readNumber(scanner, "Enter the first number: ");
        double b = readNumber(scanner, "Enter the second number: ");
        double result;

        switch (choice) {
            case "1":
                result = a + b;
                System.out.printf("Result: %s + %s = %s%n", format(a), format(b), format(result));
                break;
            case "2":
                result = a - b;
                System.out.printf("Result: %s - %s = %s%n", format(a), format(b), format(result));
                break;
            case "3":
                result = a * b;
                System.out.printf("Result: %s * %s = %s%n", format(a), format(b), format(result));
                break;
            case "4":
                if (b == 0) {
                    System.out.println("Error: Division by zero is not allowed.");
                    return;
                }
                result = a / b;
                System.out.printf("Result: %s / %s = %s%n", format(a), format(b), format(result));
                break;
            case "5":
                if (b == 0) {
                    System.out.println("Error: Modulus by zero is not allowed.");
                    return;
                }
                result = a % b;
                System.out.printf("Result: %s %% %s = %s%n", format(a), format(b), format(result));
                break;
            case "6":
                result = Math.pow(a, b);
                if (Double.isNaN(result) || Double.isInfinite(result)) {
                    System.out.println("Error: Result is undefined or out of range.");
                    return;
                }
                System.out.printf("Result: %s ^ %s = %s%n", format(a), format(b), format(result));
                break;
            case "8":
                // Interpreted as: a percent of b  ->  (a / 100) * b
                result = (a / 100.0) * b;
                System.out.printf("Result: %s%% of %s = %s%n", format(a), format(b), format(result));
                break;
            default:
                System.out.println("Unknown operation.");
        }
    }

    private static void performUnaryOperation(Scanner scanner, String choice) {
        double a = readNumber(scanner, "Enter the number: ");
        double result;

        switch (choice) {
            case "7":
                if (a < 0) {
                    System.out.println("Error: Cannot take the square root of a negative number.");
                    return;
                }
                result = Math.sqrt(a);
                System.out.printf("Result: sqrt(%s) = %s%n", format(a), format(result));
                break;
            case "9":
                result = Math.abs(a);
                System.out.printf("Result: |%s| = %s%n", format(a), format(result));
                break;
            default:
                System.out.println("Unknown operation.");
        }
    }

    private static double readNumber(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = scanner.nextLine().trim();
            try {
                return Double.parseDouble(input);
            } catch (NumberFormatException e) {
                System.out.println("Invalid number. Please try again.");
            }
        }
    }

    /**
     * Formats a double so whole numbers display without trailing ".0".
     */
    private static String format(double value) {
        if (value == Math.floor(value) && !Double.isInfinite(value)) {
            return String.valueOf((long) value);
        }
        return String.valueOf(value);
    }
}
