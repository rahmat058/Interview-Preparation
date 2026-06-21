/**
 * Author: Kazi Rahamatullah
 * Date: 2026-06-21
 * Description: Print an inverted right-angled triangle pattern of asterisks.
 *
 * Example output for n = 5:
 *     *
 *    **
 *   ***
 *  ****
 * *****
 */

/**
 * Print an inverted right-angled triangle made of '*' characters.
 * @param {number} n - Number of rows to print.
 */

// TODO: Right Aligned Triangle Pattern First Approach Solution
const rightAlignedTrianglePatternFirstApproach = (n) => {
  for (let i = 1; i <= n; i++) {
    let row = '';
    // Add spaces to align the stars to the right
    for (let j = 1; j <= n - i; j++) {
      row += ' ';
    }

    // Add stars for the current row
    for (let k = 1; k <= i; k++) {
      row += '*';
    }
    console.log(row);
  }
};

rightAlignedTrianglePatternFirstApproach(5);

// TODO: Right Aligned Triangle Pattern Second Approach Solution
const rightAlignedTrianglePatternSecondApproach = (n) => {
  for (let i = 1; i <= n; i++) {
    // Create a string with (n - i) spaces followed by i stars
    const row = ' '.repeat(n - i) + '*'.repeat(i);
    console.log(row);
  }
};

rightAlignedTrianglePatternSecondApproach(5);
