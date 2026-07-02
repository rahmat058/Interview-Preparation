# Tasks

Practice tasks for the [JavaScript Objects course](./01-javascript-objects-course-reference.md). Attempt each task before checking solutions in [02-object-practice-tasks.md](./02-object-practice-tasks.md).

> **Note:** These tasks are for your practice. If you are stuck, go back to the course reference for clarification.

---

## Fundamentals (T-001 – T-020)

- [ ] **T-001**: Create a user object using an object literal with at least 4 properties.
- [ ] **T-002**: Create an object using `new Object()` and add properties afterward.
- [ ] **T-003**: Access a property using dot notation and bracket notation with a dynamic key variable.
- [ ] **T-004**: Add a new property to an existing object and update an existing property.
- [ ] **T-005**: Delete a property from an object using the `delete` operator.
- [ ] **T-006**: Check whether a property exists using `in`, `Object.hasOwn`, and explain the difference.
- [ ] **T-007**: Destructure `name` and `email` from a user object.
- [ ] **T-008**: Destructure with rename (`name` → `userName`) and a default value for a missing property.
- [ ] **T-009**: Use rest destructuring to omit `password` from a user object and keep the rest.
- [ ] **T-010**: Destructure a nested object (e.g. `user.address.city`).
- [ ] **T-011**: Create a shallow clone of an object using the spread operator.
- [ ] **T-012**: Create a deep clone using `structuredClone` and prove nested objects are independent.
- [ ] **T-013**: Merge two configuration objects with spread — later keys should win.
- [ ] **T-014**: Merge objects with `Object.assign` and explain how it differs from spread.
- [ ] **T-015**: Get all keys, values, and entries from an object.
- [ ] **T-016**: Convert an array of `[key, value]` pairs into an object with `Object.fromEntries`.
- [ ] **T-017**: Loop over an object using `Object.entries` and `for...of`.
- [ ] **T-018**: Explain the difference between `Object.freeze`, `Object.seal`, and `Object.preventExtensions`.
- [ ] **T-019**: Define a read-only property using `Object.defineProperty`.
- [ ] **T-020**: Use optional chaining (`?.`) and nullish coalescing (`??`) on a nested user object.

---

## Product dataset (T-021 – T-040)

Use these input objects/arrays for **T-021** through **T-040**:

### `products` array

```javascript
const products = [
  { id: 'p1', name: 'Mug', categoryId: 'c1', price: 12.99, inStock: true },
  { id: 'p2', name: 'Book', categoryId: 'c2', price: 24.5, inStock: true },
  { id: 'p3', name: 'Pen', categoryId: 'c1', price: 2.99, inStock: false },
  { id: 'p4', name: 'Lamp', categoryId: 'c3', price: 45.0, inStock: true },
  { id: 'p5', name: 'Notebook', categoryId: 'c2', price: 8.5, inStock: true },
  { id: 'p6', name: 'Desk', categoryId: 'c3', price: 199.99, inStock: false },
];
```

### `categories` object (id → name lookup)

```javascript
const categories = {
  c1: 'Kitchen',
  c2: 'Stationery',
  c3: 'Furniture',
};
```

- [ ] **T-021**: Filter products that belong to the "Stationery" category.
- [ ] **T-022**: Build an array of strings like `"Mug (Kitchen)"` for every product.
- [ ] **T-023**: Find the highest-priced product.
- [ ] **T-024**: Check if any product is out of stock (`inStock: false`).
- [ ] **T-025**: Write a function `filterByMinPrice(products, minPrice)` that returns products above a price.
- [ ] **T-026**: Extract an array of product names only.
- [ ] **T-027**: Calculate total value of all in-stock products (`price` sum where `inStock` is true).
- [ ] **T-028**: Is any product priced below 5?
- [ ] **T-029**: Find the product with price exactly `8.5`.
- [ ] **T-030**: Group products by `categoryId` using `Object.groupBy`.
- [ ] **T-031**: Normalize the `products` array into an object keyed by `id` for O(1) lookup.
- [ ] **T-032**: Given a product id, write a function that returns the product name and category name.
- [ ] **T-033**: Return a new products array with all prices increased by 10% (immutable).
- [ ] **T-034**: Create an object `{ categoryName: count }` for how many products per category.
- [ ] **T-035**: Log each product name and category using `for...of` on `Object.entries` of a lookup map.
- [ ] **T-036**: Pick only `id`, `name`, and `price` from each product (implement `pick`).
- [ ] **T-037**: Omit `inStock` from each product before sending to API (implement `omit`).
- [ ] **T-038**: Merge `defaults` and `overrides` objects with a deep merge for nested `settings`.
- [ ] **T-039**: Compare two product objects for shallow equality (implement `shallowEqual`).
- [ ] **T-040**: Convert the `categories` object into a `Map` and read a category name by id.

---

## Map, Set & advanced (T-041 – T-048)

- [ ] **T-041**: Create a `Map`, set three key-value pairs (include a non-string key), and iterate with `for...of`.
- [ ] **T-042**: Convert an object to a `Map` using `Object.entries`.
- [ ] **T-043**: Convert a `Map` back to a plain object using `Object.fromEntries`.
- [ ] **T-044**: Deduplicate an array of tag strings using `Set`.
- [ ] **T-045**: Count occurrences of each word in a sentence using an object (or `Map`).
- [ ] **T-046**: Use `Object.create` to create an object that inherits a `greet` method.
- [ ] **T-047**: Explain when you would use `Map` instead of a plain object (write a short comment with an example).
- [ ] **T-048**: Safely parse JSON into an object with a fallback when parsing fails.
