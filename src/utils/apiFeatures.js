class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.q
      ? {
          title: {
            $regex: this.queryStr.q,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  paginate(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
  sort() {
    const sortBy = this.queryStr.sortBy || "createdAt";
    const sortOrder = this.queryStr.sortOrder || "asc";
    this.query = this.query.sort([[sortBy, sortOrder]]);
    return this;
  }
}

module.exports = ApiFeatures;
