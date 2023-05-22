const queue = [];

export const reports = {
  getLength: () => {
    return queue.length;
  },
  addReport: (obj) => {
    return queue.push(obj);
  },
  removeReport: () => {
    return queue.shift();
  },
};
