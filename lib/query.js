'use strict';

var _ = require('lodash'),
    valid_alterables = {
        primary: ['populate'],
        secondary: []
    },
    valid_filters = {
        primary: ['limit', 'skip', 'offset', 'select', 'sort'],
        secondary: ['equals', 'gte', 'gt', 'lte', 'lt', 'ne', 'regex', 'in']
    },
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

    [req.body, req.query, req.headers].forEach(function(alterable) {
        Object.keys(alterable).filter(function(potential_alterable) {
            return valid_alterables.hasFilter(potential_alterable, queryable);
        }).forEach(function(valid_alt) {
            queryable = valid_alterables.filter(valid_alt, alterable[valid_alt], queryable);
        });
    });

    // when querying lists attach filters to it
    if (!detail) {
        [req.body, req.query, req.headers].forEach(function(filterableData) {
            Object.keys(filterableData).filter(function(potential_filter) {
                return valid_filters.hasFilter(potential_filter, queryable);
            }).forEach(function(valid_key) {
                queryable = valid_filters.filter(valid_key, filterableData[valid_key], queryable);
            });
        });
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

/**
 * Clean a given string of data for mongoose
 * currently does nothing, will see later if still needed.
 */
function cleanData(val) {
    return val;
}

/**
 * Return an object allowing you to check whether a given filter is actually within the valid limits (see the var section for valids) and actually filter your query.
 */
function prepFilterable(props, subfilters) {
    return {
        hasFilter: function(key, query) {
            if (key in props) {
                // one of the primary filters
                return true;
            }

            // subfilters will go here...
        },
        filter: function(key, val, query) {
            if (props[key]) {
                // one of the primary filters
                return props[key](val, query);
            }

            // subfilters will go here...
        }
    };
}

function queryHelper(key) {
    return function(val, query) { return query[key](val); };
}

function prepFilters(flt) {
    var primaryFilters = {},
        secondaryFilters = {};

    flt.primary.forEach(function forEachPrimaryFilter(filter) {
        primaryFilters[filter] = queryHelper(filter);
    });
    flt.secondary.forEach(function forEachSecondaryFilter(filter) {
        secondaryFilters[filter] = queryHelper(filter);
    });
    return prepFilterable(primaryFilters, secondaryFilters);
}



function init(goose) {
    mongoose = goose;

    valid_alterables = prepFilters(valid_alterables);
    valid_filters = prepFilters(valid_filters);

    return {
        query: query,
        queryById: queryById
    };
}

exports = module.exports = init;
