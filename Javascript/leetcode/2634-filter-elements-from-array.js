/**
 * @param {number[]} arr
 * @param {Function} fn
 * @return {number[]}
 */

var fn = function greaterThan10(n) {
  return n > 10;
};

var filter = function (arr, fn) {
  // declarative programming
  // return arr.filter(fn)

  // imperative programming
  const res = [];

  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i], i)) {
      res.push(arr[i]);
    }
  }

  return res;
};

console.log(filter([0, 10, 20, 30], fn));
