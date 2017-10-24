exports.handler = (event, context, callback) => {
  const number = Number(event.number);
  if (isNaN(number)) {
    const error = new Error(`'${event.number}' is not number`);
    callback(error);
  }
  if (!Number.isInteger(number)) {
    const error = new Error(`'${event.number}' is not integer`);
    callback(error);
  }
  return callback(null, isEven(number));
};

const isEven = number => number % 2 === 0;
