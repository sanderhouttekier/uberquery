# Uberquery

## About

Supercharge your mongoose queries with request query values or parameters 
allowing you to directly limt select, offset, filter or populate your mongoose 
query from the request.

Tired of always passing in `limit` and `offset` parameters from the request into your query? 
Do you build a search functionality for single entity? Well, charge your query with 
most native filters like aforementioned `limit` and `offset` or testing `equals` or `gte` 
directly from the requested url.

**remark** I hear you, what about performance, or what about security? If anyone can query my database
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

``` js
var Uberquery = require('uberquery');
Uberquery.init(mongoose);
```

You are done. That is all you need to do to start using Uberquery.

Now you can start querying.

``` js
// start a new query
// feed it the request object.
// feed it the name of the mongoose model you want to query.
var query = Uberquery.query(req, 'User');
```

You feed Uberquery the request object so it can generate a query based on the request paramters it finds. 
The name of the entity you pass as second parameter should be the same name as your mongoose model.

## Manipulating the query afterwards

The query you recieve from Uberquery is a regular mongoose query. so you can manipulate it as you seem fit.

``` js
var query = Uberquery.query(req, 'User');
query.populate('relatives');
```

## Executing the query to recieve results

**Manually**

``` js
var query = Uberquery.query(req, 'User');
query.exec(function afterQueryExecution(err, list) {
    if(err) {
        // handle error
    }
    res.json(list); // send the resultset to the client
});
```

**Using Uberquery's handlers**

``` js
var query = Uberquery.query(req, 'User');
Uberquery.handlers.get(req, res, next);
```

## Querystring filters picked up by Uberquery

### Available Filters

#### Primary Filters

**select** usage: `?select=property1[ property2][ property3]`  
Do you only need a few properties? you can filter the return value with only the propertys you need by passing 
their names into the `select` filter.

**limit** usage: `?limit=number`  
Want only 5 items? just use `?limit=5`.

**skip** usage: `?skip=number`  
Skipping the first 5 items? just use `?skip=5`.

**sort** usage: `?sort=property1[ property2]`  
Sorting your resultset on a certain property can be done just like mongoose accepts string sorts. 
Sort order can thus be passed via a `-` in front of the propertyname. (e.g. `?sort=-propertyname`).

more information what sorting is accepted by mongoose can be found [here](http://mongoosejs.com/docs/api.html#query_Query-sort). 
*note* you can add sorting to the Uberquery in your backend nodeJS handler any time but use the string equivalent if you are 
passing it in through the url parameters.

#### Secondary Filters

You can of course also filter on your own entities properties. Supose you have a `User` entity with a `name`, `email`, `age` and `gender`. 
You could easily filter on it using one of the following queries:

```
?name=sander
?age__lte=30
?gender__ne=male
...
```

*note* searching on strings like `name=sander` is treated case sensitive.

A list of all operations possible can be found here:
*note* all examples work further on the usecase of having a `/users` route which handles the request through an Uberquery.

| Filter                       | Query  | Example                                              | Description                     |
|------------------------------|--------|------------------------------------------------------|---------------------------------|
| **equal**                    | equals | `/users?gender=male` or `/users?gender__equals=male` | both return all male users (case sensitive when searching a string property)     |
| **not equal**                | ne     | `/users?gender__ne=male`                             | returns all users who are not male (`female` or not set)          |
| **greater than**             | gt     | `/users?age__gt=18`                                  | returns all users older than 18                                   |
| **greater than or equal to** | gte    | `/users?age__gte=18`                                 | returns all users 18 and older                                    |
| **lower than**               | lt     | `/users?age__lt=30`                                  | returns all users age 29 and younger                              |
| **lower than or equal to**   | lte    | `/users?age__lte=30`                                 | returns all users age 30 and younger                              |
| **in**                       | in     | `/users?gender__in=female,male`                      | returns all female and male users and will leave out users where gender is not set, or an other value than male or female                   |
| **Regex**                    | regex  | `/users?username__regex=/^saelfaer/i`                | returns all users with a username starting with `saelfaer` (case sensitive)           |

### Available Alterables

**poulate** usage: `?populate=property1[ property2][ propeprty3]`  
Populating a referenced property. You can populate more than 1 property by joining your propertynames with a space.

## Changelog

**v0.1.3**
* cleanup of unused dependencies
* fixed package.json incorrectly stating ICS as license

**v0.1.2**
initial release
* create queries
* filter using the querystring
* manipulate them afterwards
* execute them and send the result to the client via built in handlers

## Remarks Or Issues

Got a remark or issue? I'm open to improvements so post your remarks in the [issues](/saelfaer/uberquery/issues)

## credits

The idea for this project sprung when I was using [node-restful](baugarten/node-restful) 
and wanted to use his ease of filtering on a custom route not falling in his restful way of working. 
I created this project from scratch but can't say some of the code isn't heavily influenced by the way node-restful works.

## License (MIT)

Copyright (c) 2014 by Sander Houttekier

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
