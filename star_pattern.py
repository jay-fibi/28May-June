"""
Simple program to build and print star patterns in Python.

Each pattern has a pure ``build_*`` function that returns the pattern as a
string (easy to test and reuse) and is rendered via the small ``render``
helper, which prints a titled block followed by a blank line.
"""

from __future__ import annotations


def _validate_rows(rows: int) -> None:
    """Ensure ``rows`` is a positive integer, raising otherwise."""
    if not isinstance(rows, int) or isinstance(rows, bool):
        raise TypeError(f"rows must be an int, got {type(rows).__name__}")
    if rows < 1:
        raise ValueError(f"rows must be a positive integer, got {rows}")


def build_right_triangle(rows: int) -> str:
    """Return a right-angled triangle star pattern as a string."""
    _validate_rows(rows)
    return "\n".join("*" * i for i in range(1, rows + 1))


def build_inverted_triangle(rows: int) -> str:
    """Return an inverted right-angled triangle star pattern as a string."""
    _validate_rows(rows)
    return "\n".join("*" * i for i in range(rows, 0, -1))


def build_pyramid(rows: int) -> str:
    """Return a centered pyramid star pattern as a string."""
    _validate_rows(rows)
    return "\n".join(
        " " * (rows - i) + "*" * (2 * i - 1) for i in range(1, rows + 1)
    )


def render(title: str, pattern: str) -> None:
    """Print a titled pattern block followed by a trailing blank line."""
    print(title)
    print(pattern)
    print()


if __name__ == "__main__":
    n = 5
    render("Right-Angled Triangle:", build_right_triangle(n))
    render("Inverted Triangle:", build_inverted_triangle(n))
    render("Pyramid:", build_pyramid(n))
