'use strict';

var UberQuery ={
    // Expose mongoose on UberQuery.mongoose (stub with an error if not passed trough init...)
    mongoose: undefined,
    // Expose the query on UberQuery.query (stub with an error if not passed trough init...)
    query: undefined
};

// Expose the init method on UberQuery.init ... set mongoose and the query.
UberQuery.init = function initializeQueryable(goose) {
    UberQuery.mongoose = goose;

    var qry = require('./query')(goose);

    UberQuery.query = qry.query;
    UberQuery.queryById = qry.queryById;
};

exports = module.exports = UberQuery;
