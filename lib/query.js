'use strict';

var _ = require('lodash'),
    valid_alterables = {
        primary: ['populate'],
        secondary: []
    },
    valid_filters = {
        primary: ['limit', 'skip', 'select', 'sort'],
        secondary: ['equals', 'gte', 'gt', 'lte', 'lt', 'ne', 'regex', 'in']
    },
    mongoose;

/**
 * Returns a query filtered by the data in the request
 * Looks in req.body and req.query to get the filterable data
 * Filters the query based on functions in valid_filters
 */
function filter(req, model) {
    var qry,
        options = model.uberqueryOptions,
        detail = options.isDetail;

    // filter by id
    if (detail) {
        qry = model.findById(options.id);
    } else {
        qry = model.find({});
    }

    // alterables like populate can be executed on any query
    [req.body, req.query, req.headers].forEach(function(alterable) {
        Object.keys(alterable).filter(function(potential_alterable) {
            return valid_alterables.hasFilter(potential_alterable, qry);
        }).forEach(function(valid_alt) {
            qry = valid_alterables.filter(valid_alt, alterable[valid_alt], qry);
        });
    });

    // when querying lists attach filters to it
    if (!detail) {
        [req.body, req.query, req.headers].forEach(function(filterableData) {
            Object.keys(filterableData).filter(function(potential_filter) {
                return valid_filters.hasFilter(potential_filter, qry);
            }).forEach(function(valid_key) {
                qry = valid_filters.filter(valid_key, filterableData[valid_key], qry);
            });
        });
    }
    return qry;
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

    model.uberqueryOptions = options;

    // our query placed on the request object as uberquery because req.query already exists.
    req.uberquery = filter(req, model);

    return req.uberquery;
}

/**
 * Alias for getting a single item detail
 */
function queryById(req, entity, id, options) {
    options = options || {};
    options.isDetail = true;
    options.id = id;
    return query(req, entity, options);
}

/**
 * Clean a given string of data for mongoose
 * currently only cleans boolean values... maybe more will be needed later
 */
function cleanData(input) {
    var map = {
        'true': true,
        'false': false
    };
    var keys = Object.keys(map);

    for (var i = 0; i < keys.length; i += 1) {
        var potential = keys[i];

        if (input && input.toLowerCase && input.toLowerCase() === potential) {
            return map[potential];
        }
    }

    // else nothing needs to change for now just go on...
    return input;
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

            var expression = key.split('__'),
                field = expression[0],
                func = expression[1] || 'equals';

            var fieldInModelProperties = field in query.model.schema.paths;
            var funcInValidSubfilters = func in subfilters;
            return fieldInModelProperties && funcInValidSubfilters;
        },
        filter: function(key, val, query) {
            if (props[key]) {
                // one of the primary filters
                return props[key](val, query);
            }

            var expression = key.split('__'),
                field = expression[0],
                func = expression[1] || 'equals',
                data = cleanData(val);

            // If using the `in` expression, the query wants an array
            if (func === 'in') {
                data = data.split(',');
            }

            return subfilters[func](data, query.where(field));
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
