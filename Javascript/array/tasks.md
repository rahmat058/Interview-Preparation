# Tasks

Practice tasks for the [JavaScript Arrays course](./01-javascript-arrays-course-reference.md). Attempt each task before checking solutions in [02-array-practice-tasks.md](./02-array-practice-tasks.md).

> **Note:** These tasks are for your practice. If you are stuck, go back to the course reference or videos for clarification.

---

## Questions (T-001 – T-020)

- [ ] **T-001**: Create an array of 5 elements using the Array constructor.
- [ ] **T-002**: Create an array of 3 empty slots.
- [ ] **T-003**: Create an array of 6 elements using array literals and access the fourth element using the `length` property.
- [ ] **T-004**: Use a `for` loop on the above array to print elements at odd indices.
- [ ] **T-005**: Add one element at the front and the end of an array.
- [ ] **T-006**: Remove an element from the front and the end of an array.
- [ ] **T-007**: Create an array of 10 favourite foods. Destructure the 6th food element using destructuring.
- [ ] **T-008**: Take out the last 8 food items from the above array using array destructuring (hint: rest parameter).
- [ ] **T-009**: Clone an array (shallow cloning).
- [ ] **T-010**: Empty an array using its `length` property.
- [ ] **T-011**: Create an array of 10 elements (numbers 1 to 10). Resize the array to length 6 once you find the number 5 (hint: use a `for` loop).
- [ ] **T-012**: Create an array of 10 elements. Use `splice()` to empty the array.
- [ ] **T-013**: You can empty an array in multiple ways: `length = 0`, `pop()` in a loop, `shift()` in a loop, assign `[]`, or `splice()`. Which is most efficient and why?
- [ ] **T-014**: What happens when you concatenate two empty arrays?
- [ ] **T-015**: How can you check if a value partially matches any element of an array?
- [ ] **T-016**: What is the difference between `slice()` and `splice()`?
- [ ] **T-017**: Create an array of alphanumeric strings. Sort in ascending and descending order **immutably** — the source array must not change.
- [ ] **T-018**: Give examples of sparse and dense arrays.
- [ ] **T-019**: Give practical usages of the `.fill()` method.
- [ ] **T-020**: How do you convert an array to a string?

---

## Employee dataset (T-021 – T-048)

Use these input arrays for **T-021** through **T-048**:

### `employees` array

```javascript
const employees = [
  { id: 1, name: 'Alice', departmentId: 1, salary: 5000 },
  { id: 2, name: 'Bob', departmentId: 2, salary: 7000 },
  { id: 3, name: 'Charlie', departmentId: 3, salary: 4500 },
  { id: 4, name: 'Diana', departmentId: 1, salary: 5500 },
  { id: 5, name: 'Edward', departmentId: 2, salary: 8000 },
  { id: 6, name: 'Fiona', departmentId: 4, salary: 6000 },
  { id: 7, name: 'George', departmentId: 3, salary: 5200 },
  { id: 8, name: 'Helen', departmentId: 4, salary: 7200 },
  { id: 9, name: 'Ian', departmentId: 2, salary: 4800 },
  { id: 10, name: 'Jane', departmentId: 1, salary: 5100 },
];
```

### `departments` array

```javascript
const departments = [
  { id: 1, name: 'HR' },
  { id: 2, name: 'Engineering' },
  { id: 3, name: 'Marketing' },
  { id: 4, name: 'Sales' },
];
```

- [ ] **T-021**: Filter employees who work in the "Engineering" department.
- [ ] **T-022**: Create a new array combining employee names and department names: `"Alice (HR)"`.
- [ ] **T-023**: Find the highest salary among employees.
- [ ] **T-024**: Check if there is at least one employee in the "Sales" department.
- [ ] **T-025**: Write a function to filter employees earning more than 6000.
- [ ] **T-026**: Create an array of employee names only.
- [ ] **T-027**: Calculate the total salary of all employees using `reduce`.
- [ ] **T-028**: Is there any employee earning less than 5000?
- [ ] **T-029**: Find the first employee who earns exactly 5100.
- [ ] **T-030**: Find the last employee in the "HR" department.
- [ ] **T-031**: Find the first employee in the "Marketing" department.
- [ ] **T-032**: Check if all employees earn more than 4000.
- [ ] **T-033**: Find the first employee in the "Sales" department.
- [ ] **T-034**: Verify if all employees belong to a department listed in the `departments` array.
- [ ] **T-035**: Log each employee's name and department name to the console.
- [ ] **T-036**: Extract all employee names into a single array.
- [ ] **T-037**: Increment each employee's salary by 10%.
- [ ] **T-038**: Assume each employee can have multiple skills. Create an array of employee skills and flatten them. Example: `[{ name: 'Alice', skills: ['Excel', 'Management'] }, ...]`.
- [ ] **T-039**: Find the total salary of all employees in the "Engineering" department.
- [ ] **T-040**: Check if there is any department where all employees earn more than 5000.
- [ ] **T-041**: Assume each employee has a `projects` array (e.g. `{ id: 1, name: 'Alice', projects: ['Project A', 'Project B'] }`). Find the total number of unique projects across all employees.
- [ ] **T-042**: For each employee, find their department name and return an array of `{ name, departmentName }`.
- [ ] **T-043**: Get a list of names of employees earning more than 6000.
- [ ] **T-044**: Write a `for...of` loop to print all employee names.
- [ ] **T-045**: Using a `for...of` loop, print names of employees earning more than 5000.
- [ ] **T-046**: Modify the `for...of` loop to destructure each employee object and log `name` and `salary`.
- [ ] **T-047**: Write a `for...of` loop to match employees with their departments and print the results.
- [ ] **T-048**: Use `Array.prototype.entries()` with a `for...of` loop to print the index and name of each employee.

---

## Array-like & static methods (T-049 – T-054)

- [ ] **T-049**: Given the array-like object below, access the second element and log it:

  ```javascript
  const arrayLike = { 0: 'First', 1: 'Second', length: 2 };
  ```

- [ ] **T-050**: Write a function that takes a variable number of arguments and converts the `arguments` object into a real array using `Array.from`.
- [ ] **T-051**: Write a snippet to select all `div` elements on a webpage (`document.querySelectorAll`) and convert the resulting `NodeList` into an array.
- [ ] **T-052**: Merge these two arrays into a single array:

  ```javascript
  const arr1 = [1, 2];
  const arr2 = [3, 4];
  ```

- [ ] **T-053**: Create an array of `n` duplicate values using `Array.from`. Input: 5 `"A"` values. Output: `["A", "A", "A", "A", "A"]`.
- [ ] **T-054**: Use `Array.from` to convert the string `"Hello"` into an array of characters.
