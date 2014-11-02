'use strict';

var Queryable ={
    // Expose mongoose on Queryable.mongoose (stub with an error if not passed trough init...)
    mongoose: undefined,
    // Expose the query on Queryable.query (stub with an error if not passed trough init...)
    query: undefined
};

// Expose the init method on Queryable.init ... set mongoose and the query.
Queryable.init = function initializeQueryable(goose) {
    Queryable.mongoose = goose;

    var qry = require('./query')(goose);

    Queryable.query = qry.query;
};

exports = module.exports = Queryable;
