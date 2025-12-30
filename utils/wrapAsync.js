function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => {
      next(err);  //Every .then() and .catch() returns a NEW Promise. that's why we have not used "throw"
    });
  };
}
module.exports = wrapAsync;