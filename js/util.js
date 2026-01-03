const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getUniqueId = (() => {
  const used = [];
  return () => {
    let num;
    num = getRandomInteger(1, 25);
    while (used.includes(num)) {
      num = getRandomInteger(1, 25);
    }
    used.push(num);
    return num;
  };
})();

export {getRandomInteger};
export{getUniqueId};
