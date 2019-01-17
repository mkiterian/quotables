const queryBuilder = req => {
  const year = req.query.year;
  const author = req.query.author;
  const postedBy = req.query.username;
  let query = {};
  if (year) {
    query = { ...query, year };
  }
  if (author) {
    query = { ...query, author };
  }
  if (postedBy) {
    query = { ...query, postedBy };
  }
  return query;
};

module.exports = queryBuilder;
