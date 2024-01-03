const wait = (ms?: number) => {
  if (ms) return new Promise((resolve) => setTimeout(resolve, ms));
};

export default wait;
