/**
 * Author: Kazi Rahamatullah
 * Date: 2026-06-17
 * Description: Print a right-angled triangle pattern of asterisks.
 *
 * Example output for n = 5:
 * *
 * **
 * ***
 * ****
 * *****
 */

/**
 * Print a right-angled triangle made of '*' characters.
 * @param {number} n - Number of rows to print.
 */

// TODO: Right Angled Triangle Pattern First Approach Solution
const rightAngledTrianglePatternFirstApproach = (n) => {
  for (let i = 1; i <= n; i++) {
    let row = '';
    for (let j = 1; j <= i; j++) {
      row += '*';
    }
    console.log(row);
  }
};

rightAngledTrianglePatternFirstApproach(5);

// TODO: Right Angled Triangle Pattern Second Approach Solution
const rightAngledTrianglePatternSecondApproach = (n) => {
  for (let i = 1; i <= n; i++) {
    // build a single row of i stars and print it
    console.log('*'.repeat(i));
  }
};

rightAngledTrianglePatternSecondApproach(5);
