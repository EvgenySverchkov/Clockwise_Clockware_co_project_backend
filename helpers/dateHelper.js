exports.isClientDateLargeThenCurrDate = function (clientDate) {
  const clientDt = new Date(clientDate);
  const currDate = new Date();
  currDate.setDate(currDate.getDate()-1);
  if (currDate.getTime() > clientDt.getTime()) {
    return false;
  } else {
    return true;
  }
};
