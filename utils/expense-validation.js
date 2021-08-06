exports.validateIsNumber = (number) => {
  return typeof number === "number" ? true : false;
};

exports.validateIsString = (string) => {
  return typeof string === "string" ? true : false;
};

exports.validateIsDate = (date) => {
  return date instanceof Date && !isNaN(date);
};
