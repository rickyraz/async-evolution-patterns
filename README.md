# Asynchronous Programming Patterns Evolution

This repository demonstrates the evolution of asynchronous programming patterns in TypeScript, showing the progression from problematic callback-based code to more maintainable solutions using modern approaches with Deno runtime.

## Overview

The code in this repository illustrates three main asynchronous programming patterns:

1. **Callback Hell** - Traditional nested callbacks approach
2. **Promise Heaven** - Modern Promise-based approach
3. **Effect Heaven** - Advanced functional approach using Effect TS

Each implementation demonstrates a complex order processing workflow with the same business logic but using different programming patterns.

## Contained Files

- `callback-hell.ts` - Example of deeply nested callbacks in TypeScript
- `callback-hell-solution.ts` - Solutions to callback hell using Promises and async/await
- `effectts-solution.ts` - Advanced solution using Effect TS library

## The Order Processing Flow

All implementations model the same workflow:

1. Fetch user data
2. Retrieve user orders
3. Get product details
4. Check product inventory
5. Process payment
6. Update order status to "processing"
7. Create shipment
8. Update order status to "shipped"
9. Send email confirmation to customer

## Implementation Comparison

### Callback Hell (Anti-Pattern)

The callback hell implementation shows deeply nested callbacks where each asynchronous operation is nested inside the callback function of the previous operation. This results in:

- Pyramid-shaped code that shifts continuously to the right
- Difficult error handling with repetitive checks
- Hard-to-follow code flow
- Poor maintainability

```typescript
function processOrder(userId, productId, quantity, address, finalCallback) {
  getUserById(userId, (userError, user) => {
    if (userError) return finalCallback(userError);
    
    getOrdersByUser(userId, (orderError, orders) => {
      if (orderError) return finalCallback(orderError);
      // More nesting...
    });
  });
}
```

### Promise Heaven

The Promise-based solutions demonstrate how to flatten the callback structure using Promise chains and async/await:

#### Promise Chain

```typescript
function processOrderWithPromises(userId, productId, quantity, address) {
  return getUserByIdPromise(userId)
    .then(user => {
      userData = user;
      return getOrdersByUserPromise(userId);
    })
    .then(orders => {
      // ...and so on
    });
}
```

#### Async/Await

```typescript
async function processOrderWithAsyncAwait(userId, productId, quantity, address) {
  try {
    const user = await getUserByIdPromise(userId);
    const orders = await getOrdersByUserPromise(userId);
    // ...and so on
  } catch (error) {
    // Centralized error handling
    throw error;
  }
}
```

### Effect Heaven

The Effect TS solution demonstrates a more advanced functional approach with:

- Explicit type-safe error handling
- Lazy evaluation
- Pure functional composition
- Generator-based syntax similar to async/await

```typescript
const processOrderWithEffectGen = (userId, productId, quantity, address) => {
  return Effect.gen(function* (_) {
    const user = yield* _(userService.getUserById(userId));
    const orders = yield* _(orderService.getOrdersByUser(userId));
    // ...and so on
  });
}
```

## Benefits of Modern Approaches

### Promise-based Benefits

- Linear code flow (no "pyramid of doom")
- Centralized error handling
- Chaining operations without deep nesting
- Better readability and maintainability

### Effect TS Benefits

- Type-safe error handling (errors are part of the type signature)
- Lazy evaluation (effects are descriptions, not executions)
- Pure functional composition
- Advanced error handling with tagged errors
- Modular code organization
- Code that resembles synchronous programming with generators

## Running the Examples with Deno

1. Install Deno (if not already installed):

   ```cli
   # On macOS, Linux, or WSL:
   curl -fsSL https://deno.land/install.sh | sh
   
   # On Windows with PowerShell:
   irm https://deno.land/install.ps1 | iex
   ```

2. Install the Effect TS library:
   Add an effect package:

   ```cli
   deno add npm:effect
   ```

3. Run the examples:

   ```cli
   deno run callback-hell.ts
   deno run callback-hell-solution.ts
   deno run effectts-solution.ts
   ```

## Deno Advantages

- No need for a package.json or node_modules
- Built-in TypeScript support
- Secure by default
- Modern JavaScript features
- Standard library with useful utilities
- Top-level await support
- Simplified module system

## Learning Resources

- [JavaScript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [Effect TS Documentation](https://effect.website/)
- [Deno Documentation](https://deno.land/manual)

## License

MIT
