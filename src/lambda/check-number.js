exports.handler = (event, context, callback) => {
  if (typeof event.number === 'string' && !event.number.trim()) {
    const error = new Error(`Empty string is not allowed`);
    return callback(error);
  }
  const number = Number(event.number);
  if (isNaN(number)) {
    const error = new Error(`'${event.number}' is not number`);
    return callback(error);
  }
  if (!Number.isInteger(number)) {
    const error = new Error(`'${event.number}' is not integer`);
    return callback(error);
  }
  callback(null, isEven(number));
};

const isEven = number => number % 2 === 0;
