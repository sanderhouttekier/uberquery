# Uberquery

## About

Supercharge your mongoose queries with request query values or parameters 
allowing you to directly limt select, offset, filter or populate your mongoose 
query from the request.

Tired of always passing in `limit` and `offset` parameters from the request into your query? 
Do you build a search functionality for single entity? Well, charge your query with 
most native filters like aforementioned `limit` and `offset` or testing `equals` or `gte` 
directly from the requested url.

## Remark

I hear you, what about performance, or what about security? If anyone can query my database
from the ease of typing in an url with some parameters, where is my security?

Well, Uberquery is not secure, just as much as it includes caching. But then again,
Uberquery was not made to be a unicorn. There are many modules available helping you 
with caching and authentication. Use those to block of unwanted use of your endpoints.

## Usage

Install Uberquery via `npm`:

```
npm install --save uberquery
```

Initialize it into your application and pass in your mongoose, on which you registered your models

```
var Uberquery = require('uberquery');
Uberquery.init(mongoose);
```

You are done. That is all you need to do to start using Uberquery.

Now you can start querying.

```
// start a new query
// feed it the request object.
// feed it the name of the mongoose model you want to query.
var query = Uberquery.query(req, 'User');
```

You feed Uberquery the request object so it can generate a query based on the request paramters it finds. 
The name of the entity you pass as second parameter should be the same name as your mongoose model.

## Available Filters

### Primary Filters

*comming soon*

### Secondary Filters

*comming soon*

## Available Alterables

*comming soon*

## Remarks Or Issues

Got a remark or issue? I'm open to improvements so post your remarks in the [issues](/saelfaer/uberquery/issues)

## License (MIT)

Copyright (c) 2014 by Sander Houttekier

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
