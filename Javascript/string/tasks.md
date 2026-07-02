# Tasks

Practice tasks for the [JavaScript Strings course](./01-javascript-strings-course-reference.md). Attempt each task before checking solutions in [02-string-practice-tasks.md](./02-string-practice-tasks.md).

> **Note:** These tasks are for your practice. If you are stuck, go back to the course reference for clarification.

---

## Fundamentals (T-001 – T-020)

- [ ] **T-001**: Create a string using single quotes, double quotes, and a template literal.
- [ ] **T-002**: Get the length of a string and access the first and last characters.
- [ ] **T-003**: Use `charAt()` and bracket notation to read characters; compare out-of-bounds behavior.
- [ ] **T-004**: Use `at()` with a negative index to get the last character.
- [ ] **T-005**: Prove that strings are immutable — explain why `s[0] = 'X'` does not work.
- [ ] **T-006**: Convert a string to uppercase and lowercase.
- [ ] **T-007**: Trim whitespace from the start, end, and both sides of a string.
- [ ] **T-008**: Check if a string `includes`, `startsWith`, and `endsWith` a substring.
- [ ] **T-009**: Find the first and last index of a substring using `indexOf` and `lastIndexOf`.
- [ ] **T-010**: Extract a substring using `slice` with positive and negative indices.
- [ ] **T-011**: Explain the difference between `slice` and `substring`.
- [ ] **T-012**: Replace the first occurrence of a substring with `replace`.
- [ ] **T-013**: Replace all occurrences with `replaceAll` (or regex with `g` flag).
- [ ] **T-014**: Split a comma-separated string into an array and split a string into characters.
- [ ] **T-015**: Join an array of words into a single sentence string.
- [ ] **T-016**: Pad a number string to 5 characters using `padStart` and `padEnd`.
- [ ] **T-017**: Repeat a character string 10 times using `repeat`.
- [ ] **T-018**: Get character codes with `charCodeAt` and build a string with `String.fromCharCode`.
- [ ] **T-019**: Explain why `'😀'.length` is `2` and how to count emoji correctly.
- [ ] **T-020**: Use a template literal to build an HTML snippet with embedded expressions.

---

## Article dataset (T-021 – T-040)

Use this input for **T-021** through **T-040**:

```javascript
const articles = [
  { id: 1, title: '  Learn JavaScript  ', author: 'alice@company.io', tags: 'js,web,api' },
  { id: 2, title: 'React Hooks Guide', author: 'bob@mail.com', tags: 'react,hooks' },
  { id: 3, title: 'NODE.JS PERFORMANCE', author: 'carol@company.io', tags: 'node,perf' },
  { id: 4, title: 'css tricks for beginners', author: 'dave@mail.com', tags: 'css,ui' },
  { id: 5, title: 'API Design Patterns  ', author: 'eve@startup.io', tags: 'api,design,js' },
];
```

- [ ] **T-021**: Return a new array of trimmed, lowercased titles (immutable).
- [ ] **T-022**: Filter articles whose author email includes `@company.io`.
- [ ] **T-023**: Extract the domain part from each author email (after `@`).
- [ ] **T-024**: Create a URL slug from each title: lowercase, trim, spaces → hyphens.
- [ ] **T-025**: Find articles whose title includes `'javascript'` (case-insensitive).
- [ ] **T-026**: Split the `tags` string into an array for each article.
- [ ] **T-027**: Join tags with `' | '` for display.
- [ ] **T-028**: Format each `id` as a 4-digit string (`0001`, `0002`, …).
- [ ] **T-029**: Replace all spaces in a title with underscores.
- [ ] **T-030**: Count words in a title (split on whitespace).
- [ ] **T-031**: Reverse the word order in a title (`'a b c'` → `'c b a'`).
- [ ] **T-032**: Check if every author email ends with `.com` or `.io`.
- [ ] **T-033**: Get the username portion of each email (before `@`).
- [ ] **T-034**: Capitalize the first letter of every word in a title (title case).
- [ ] **T-035**: Truncate titles longer than 20 characters with an ellipsis (`…`).
- [ ] **T-036**: Return articles matching a search term in title or tags (case-insensitive).
- [ ] **T-037**: Extract the top-level domain (`.com`, `.io`) from each email.
- [ ] **T-038**: Parse a log line like `[ERROR] user=alice code=500` into key-value pairs.
- [ ] **T-039**: Wrap a search term in `<mark>` inside a title string (highlight match).
- [ ] **T-040**: Sort article titles alphabetically using `localeCompare`.

---

## Regex, templates & advanced (T-041 – T-048)

- [ ] **T-041**: Validate a basic email format with a regex and `.test()`.
- [ ] **T-042**: Extract all numbers from a string using `.match()` with the `g` flag.
- [ ] **T-043**: Use `matchAll` to collect all digit groups from a string.
- [ ] **T-044**: Build a multi-line template literal with interpolated name and date.
- [ ] **T-045**: Write a simple tagged template function that wraps values in `<strong>`.
- [ ] **T-046**: Use `String.raw` to store a Windows file path without escaping backslashes.
- [ ] **T-047**: Normalize a Unicode string with `.normalize('NFC')`.
- [ ] **T-048**: Parse a query string (`?page=2&sort=name`) into an object using `URLSearchParams`.
