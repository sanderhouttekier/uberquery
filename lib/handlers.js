'use strict';

/**
 * Initial attempt at a get handler finishing off an uberquery and passing the results into the send handler
 * in the future more handlers might be added if needed
 */
exports.get = function get(req, res, next) {
    req.uberquery.exec(function afterQueryExecution(err, list) {
        exports.respondOrErr(res, 500, err, 200, (req.params.id && list && list.length > 0) ? list[0] : list);
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

    res.send();
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
