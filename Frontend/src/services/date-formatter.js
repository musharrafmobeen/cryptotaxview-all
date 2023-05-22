import Moment from "moment";
export const formatDate = (date) => {
  return Moment(date).format("DD MMM YYYY, h:m A");
};
export const formatFullDate = (date) => {
  return Moment(date).format("ddd, MMM Do, YYYY, h:m A");
};
export const formatDateTransactionsTable = (date) => {
  return Moment(date).format("MMM DD, YYYY");
};
export const formatDateTransactionsTableFull = (date) => {
  return Moment(date).format("ddd, MMM Do, YYYY");
};

export const formatRowDateTransactionsTable = (date) => {
  return Moment(date).format("h:m A");
};

export const formatShortDate = (date) => {
  return Moment(date).format("h:m A, MMMM DD, YYYY");
};
