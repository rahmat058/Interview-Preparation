/**
 * Author: Kazi Rahamatullah
 * Date: 2026-06-25
 * Description: Print a diamond pattern of asterisks.
 *
 * Example output for n = 5:
 *            *
 *           ***
 *          *****
 *         *******
 *        *********
 *         *******
 *          *****
 *           ***
 *            *
 */

/**
 * Print a pyramid pattern of asterisks.
 * @param {number} n - Number of rows to print.
 */

const diamondPatternFirstApproach = (n) => {
  // Print upper half (including middle)
  for (let i = 1; i <= n; i++) {
    let row = '';
    // Print leading spaces
    for (let j = 1; j <= n - i; j++) {
      row += ' ';
    }
    // Print stars
    for (let k = 1; k <= 2 * i - 1; k++) {
      row += '*';
    }
    console.log(row);
  }

  // Print lower half
  for (let i = n - 1; i >= 1; i--) {
    let row = '';
    // Print leading spaces
    for (let j = 1; j <= n - i; j++) {
      row += ' ';
    }
    // Print stars
    for (let k = 1; k <= 2 * i - 1; k++) {
      row += '*';
    }
    console.log(row);
  }
};

diamondPatternFirstApproach(5);

console.log('-------------------');

const diamondPatternSecondApproach = (n) => {
  // Print upper half (including middle)
  for (let i = 1; i <= n; i++) {
    let spaces = ' '.repeat(n - i);
    let stars = '*'.repeat(2 * i - 1);
    console.log(spaces + stars);
  }
  // Print lower half
  for (let i = n - 1; i >= 1; i--) {
    let spaces = ' '.repeat(n - i);
    let stars = '*'.repeat(2 * i - 1);
    console.log(spaces + stars);
  }
};

diamondPatternSecondApproach(5);
