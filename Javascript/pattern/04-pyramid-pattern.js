/**
 * Author: Kazi Rahamatullah
 * Date: 2026-06-21
 * Description: Print an inverted right-angled triangle pattern of asterisks.
 *
 * Example output for n = 5:
 *            *
 *           ***
 *          *****
 *         *******
 *        *********
 */

/**
 * Print an inverted right-angled triangle made of '*' characters.
 * @param {number} n - Number of rows to print.
 */

const pyramidPattern = (n) => {
  for (let i = 1; i <= n; i++) {
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

pyramidPattern(5);
