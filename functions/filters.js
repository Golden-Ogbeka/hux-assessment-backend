const getDateFilters = (req) => {
  const { from, to } = req.query;
  let filters = {};

  if (from && to) {
    filters = {
      date: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    };
  } else {
    filters = {};
  }

  return filters;
};

module.exports = {
  getDateFilters,
};
