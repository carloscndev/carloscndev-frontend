# Testing Guide

## Overview

This project uses **Vitest** with **happy-dom** for unit testing.
Follow the AAA (Arrange-Act-Assert) pattern for all tests.

## Quick Start

```bash
# Run all tests
npm test

# Watch mode (re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Open Vitest UI
npm run test:ui
```

## Project Structure

```
src/
  __tests__/
    setup.ts              # Global mocks (localStorage, matchMedia)
    utils/                 # Tests for src/utils/*.ts
    data/                  # Tests for src/data/*.json
    components/            # Tests for src/components/
  utils/
    *.ts                   # Source code
```

## Writing Tests

### AAA Pattern

```typescript
import { describe, it, expect } from "vitest";

describe("ModuleName", () => {
  describe("functionName", () => {
    it("should handle the expected case", () => {
      // Arrange - set up test data
      document.body.innerHTML = '<div id="target"></div>';

      // Act - call the function
      const result = doSomething();

      // Assert - verify the outcome
      expect(result).toBe(expectedValue);
    });

    it("should handle edge cases", () => {
      // Test null, undefined, empty values
    });

    it("should handle errors gracefully", () => {
      // Test error conditions
    });
  });
});
```

### Common Mocks

```typescript
// localStorage (auto-mocked in setup.ts)
localStorage.getItem = vi.fn(() => "stored-value");
localStorage.setItem = vi.fn();

// scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// IntersectionObserver
const mockObserver = vi.fn();
window.IntersectionObserver = mockObserver;

// DOM elements
document.body.innerHTML = '<div id="container"><button>Click</button></div>';
```

### Testing Utility Functions

Utility functions that update the DOM should:

1. Set up the required HTML structure with embedded JSON data
2. Call the update function
3. Assert that DOM elements have the expected text/content

```typescript
it("should update from embedded JSON", () => {
  const data = { es: { title: "Hola" }, en: { title: "Hello" } };
  const el = document.createElement("script");
  el.id = "my-data";
  el.textContent = JSON.stringify(data);
  document.body.appendChild(el);

  document.body.innerHTML += "<p data-my-title></p>";

  updateContent("es");

  const title = document.querySelector("[data-my-title]")!;
  expect(title.textContent).toBe("Hola");
});
```

## Coverage Thresholds

| Metric     | Minimum |
| ---------- | ------- |
| Lines      | 50%     |
| Statements | 47%     |
| Functions  | 35%     |
| Branches   | 30%     |

## CI Integration

Tests run automatically on pre-commit via husky.
Run `npm test` before pushing to ensure all tests pass.
