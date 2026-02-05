//wrapAsync function to handle errors in async functions
const asyncWrap = (fn) => {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncWrap;