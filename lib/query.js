'use strict';

var _ = require('lodash'),
    mongoose;

/**
 * Returns a query filtered by the data in the request
 * Looks in req.body and req.query to get the filterable data
 * Filters the query based on functions in valid_filters
 */
function filter(req, model) {
    var queryable,
        opts = model.queryableOptions,
        detail = opts.detail;

    // filter by id
    if (detail) {
        queryable = model.findById(opts.id);
    } else {
        queryable = model.find({});
    }

    return queryable;
}

/**
 * Returns the query
 * registers the query with mongoose
 */
function query(req, entity, options) {
    options = options || {};
    req.body = req.body || {};
    req.query = req.query || {};

    var model = mongoose.model(entity);

    model.queryableOptions = options;

    req.queryable = filter(req, model);

    return req.queryable;
}

/**
 * Alias for getting a single item detail
 */
function queryById(req, entity, id, options) {
    options = options || {};
    options.detail = true;
    options.id = id;
    return query(req, entity, options);
}


function init(goose) {
    mongoose = goose;

    return {
        query: query,
        queryById: queryById
    };
}

exports = module.exports = init;
