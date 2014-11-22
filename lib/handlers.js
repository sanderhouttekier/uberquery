'use strict';

/**
 * Get items from the query, could be a list or a single items but it will be returned as is.
 */
exports.get = function get(req, res, next) {
    req.uberquery.exec(function afterQueryExecution(err, objOrList) {
        exports.respondOrErr(res, 500, err, 200, objOrList);
        exports.send(req, res, next);
    });
};

/**
 * Get one item from the query, if its a list, first item is returned. else the object is returned as is
 */
exports.getOne = function get(req, res, next) {
    req.uberquery.exec(function afterQueryExecution(err, objOrList) {
        exports.respondOrErr(res, 500, err, 200, (objOrList.length > 0) ? objOrList[0] : objOrList);
        exports.send(req, res, next);
    });
};


/**
 * finish off a request by sending the contents of the bundle back to the client
 */
exports.send = function send(req, res, next) {
    if (req.body.format === 'js') {
        res.send(res.locals.bundle);
    } else {
        res.status(res.locals.status_code).json(res.locals.bundle);
    }
};

/**
 * Takes a response, error statuscode, error, success statuscode and success payload
 * Responds to an error, and if not present responds succesfully.
 */
exports.respondOrErr = function(res, errStatuscode, err, statuscode, content) {
    if (err) {
        exports.respond(res, errStatuscode, err);
    } else {
        exports.respond(res, statuscode, content);
    }
};

/**
 * Takes a response, statuscode and payload
 * it returns statuscode with the specified payload
 */
exports.respond = function(res, statuscode, content) {
    res.locals.status_code = statuscode;
    res.locals.bundle = content;
};
