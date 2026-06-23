var map = function (arr, fn) {
  const result = new Array(arr.length); // dynamic arrays

  for (const i in arr) {
    result[i] = fn(arr[i], Number(i));
  }

  return result;
};

const arr = [1, 2, 3];
const fn = function plusone(n) {
  return n + 1;
};

console.log(map(arr, fn));
