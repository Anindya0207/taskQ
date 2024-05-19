export const getRandomId = (function uniqueIdSingleton() {
  let count = Math.floor(Math.random() * 10000000000);
  return function incrementer(id = '') {
    return id + count++;
  };
})();
