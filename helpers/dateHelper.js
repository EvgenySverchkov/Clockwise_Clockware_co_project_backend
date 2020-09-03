exports.isClientDateLargeThenCurrDate = function (clientDate) {
  const clientDt = new Date(clientDate);
  const currDate = new Date();

  if (currDate.getTime() > clientDt.getTime()) {
    return false;
  } else {
    return true;
  }
};
