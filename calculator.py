"""
Simple Calculator in Python
Supports: addition, subtraction, multiplication, division,
          modulus, exponentiation, integer division, average,
          percentage, absolute difference, maximum, and minimum.
"""


def add(a, b):
    return a + b


def subtract(a, b):
    return a - b


def multiply(a, b):
    return a * b


def divide(a, b):
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero.")
    return a / b


def modulus(a, b):
    if b == 0:
        raise ZeroDivisionError("Cannot perform modulus by zero.")
    return a % b


def power(a, b):
    return a ** b


def floor_divide(a, b):
    if b == 0:
        raise ZeroDivisionError("Cannot perform floor division by zero.")
    return a // b


def average(a, b):
    return (a + b) / 2


def percentage(a, b):
    if b == 0:
        raise ZeroDivisionError("Cannot calculate percentage with zero total.")
    return (a / b) * 100


def absolute_difference(a, b):
    return abs(a - b)


def maximum(a, b):
    return max(a, b)


def minimum(a, b):
    return min(a, b)


OPERATIONS = {
    "1": ("Add (+)", add),
    "2": ("Subtract (-)", subtract),
    "3": ("Multiply (*)", multiply),
    "4": ("Divide (/)", divide),
    "5": ("Modulus (%)", modulus),
    "6": ("Power (**)", power),
    "7": ("Floor Divide (//)", floor_divide),
    "8": ("Average", average),
    "9": ("Percentage (a is what % of b)", percentage),
    "10": ("Absolute Difference (|a - b|)", absolute_difference),
    "11": ("Maximum", maximum),
    "12": ("Minimum", minimum),
}


def get_number(prompt):
    while True:
        try:
            return float(input(prompt))
        except ValueError:
            print("Invalid number. Please try again.")


def show_menu():
    print("\n===== Calculator =====")
    for key, (label, _) in OPERATIONS.items():
        print(f"{key}. {label}")
    print("0. Exit")


def main():
    print("Welcome to the Python Calculator!")
    while True:
        show_menu()
        choice = input("Choose an option: ").strip()

        if choice == "0":
            print("Goodbye!")
            break

        if choice not in OPERATIONS:
            print("Invalid choice. Please select a valid option.")
            continue

        label, func = OPERATIONS[choice]
        num1 = get_number("Enter the first number: ")
        num2 = get_number("Enter the second number: ")

        try:
            result = func(num1, num2)
            print(f"Result of {label}: {result}")
        except ZeroDivisionError as e:
            print(f"Error: {e}")


if __name__ == "__main__":
    main()
