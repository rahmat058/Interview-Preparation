/**
 * Author: Kazi Rahamatullah
 * Date: 2026-06-23
 * Description: Print an inverted pyramid pattern of asterisks.
 *
 * Example output for n = 5:
 *           *********
 *            *******
 *             *****
 *              ***
 *               *
 */

/**
 * Print an inverted pyramid pattern of asterisks.
 * @param {number} n - Number of rows to print.
 */

const invertedPyramidPatternFirstApproach = (n) => {
  for (let i = n; i >= 1; i--) {
    let row = '';
    // Print leading spaces
    for (let j = 1; j <= n - i; j++) {
      row += ' ';
    }
    // Print asterisks
    for (let k = 1; k <= 2 * i - 1; k++) {
      row += '*';
    }
    console.log(row);
  }
};

invertedPyramidPatternFirstApproach(5);

const invertedPyramidPatternSecondApproach = (n) => {
  for (let i = n; i >= 1; i--) {
    // Create a string with (n - i) spaces followed by (2 * i - 1) stars
    const row = ' '.repeat(n - i) + '*'.repeat(2 * i - 1);
    console.log(row);
  }
};

invertedPyramidPatternSecondApproach(5);