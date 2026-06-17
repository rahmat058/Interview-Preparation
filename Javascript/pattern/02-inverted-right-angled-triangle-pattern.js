/**
 * Author: Kazi Rahamatullah
 * Date: 2026-06-17
 * Description: Print an inverted right-angled triangle pattern of asterisks.
 *
 * Example output for n = 5:
 * *****
 * ****
 * ***
 * **
 * *
 */

/**
 * Print an inverted right-angled triangle made of '*' characters.
 * @param {number} n - Number of rows to print.
 */

// Inverted Right Angled Triangle Pattern First Approach Solution
const invertedRightAngledTrianglePatternFirstApproach = (n) => {
  for (let i = n; i >= 1; i--) {
    let row = '';
    for (let j = 1; j <= i; j++) {
      row += '*';
    }
    console.log(row);
  }
};

invertedRightAngledTrianglePatternFirstApproach(5);

// Inverted Right Angled Triangle Pattern Second Approach Solution
const invertedRightAngledTrianglePatternSecondApproach = (n) => {
  for (let i = n; i >= 1; i--) {
    // build a single row of i stars and print it
    console.log('*'.repeat(i));
  }
};

invertedRightAngledTrianglePatternSecondApproach(5);
