/*
*********************************************
ApiFeature : A class with fuctionality of
            filter,sorting,limitFields and pagination of data requested by user.

Constructor : Constructor of this class will  take two parameters 
    1-dbquery : Database query
    2-queryString : {req.query} User's requested query.

*********************************************
*/

class ApiFeatures {
  constructor(dbquery, queryString) {
    this.dbquery = dbquery;
    this.queryString = queryString;
  }

  // filter
  filter() {
    const queryObject = { ...this.queryString };
    const excludeField = ["page", "sort", "fields", "limit"];
    excludeField.forEach((ele) => delete queryObject[ele]);

    // Advance filtering
    // convert js object into string
    let queryStr = JSON.stringify(queryObject);
    // $ sign in front of operators
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|and|or)\b/g,
      (match) => `$${match}`
    );
    // converting string into object
    queryStr = JSON.parse(queryStr);

    // Change database Query
    this.dbquery = this.dbquery.find(queryStr);
    // returning class object
    return this;
  }
  // Sort
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.dbquery = this.dbquery.sort(sortBy);
    } else {
      this.dbquery = this.dbquery.sort("-createdAt");
    }
    return this;
  }

  // Limit field
  limitFields() {
    if (this.queryString.fields) {
      const limitByField = this.queryString.fields.split(",").join(" ");
      this.dbquery = this.dbquery.select(limitByField);
    } else {
      this.dbquery = this.dbquery.select("-__v");
    }
    return this;
  }

  // Pagination
  paginate() {
    // if page is not given then page should be 1
    // Here we are multipling by 1 so that page value converts into number type
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.dbquery = this.dbquery.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeatures;
