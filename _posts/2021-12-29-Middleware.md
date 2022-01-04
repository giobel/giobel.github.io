---
title: 8. Middleware
layout: post
date: 21/12/29
---

### Middleware
[Docs](https://expressjs.com/en/guide/writing-middleware.html)
- Functions that run between request and response requests.

```js
//middleware that runs on every request 
//must have .next to pass to the next middleware
app.use(()=>{
    console.log('Hey')
})

app.get('/', (req, res) =>{
    res.send("Hello from me")
})

app.get('/dogs', (req, res)=>{
    res.send('bau');
})
```

- using *next()*

```js
app.use((req, res, next)=>{
    console.log('My first middleware');
    next();
    //this will be executed after all the requests
    //not good practice
    console.log('after second');
});
//second middleware
app.use((req, res, next)=>{
    console.log(req.method.toUpperCase(), req.path);
    next();
});
```

```js
//another middleware
//change all the request method to GET
app.use((req, res, next)=>{
    req.method = 'GET'
    console.log(req.method.toUpperCase(), req.path);
    return next();
});
```
```js
//store the time in the req to access it later
app.use((req, res, next)=>{
    req.myTime = Date.now();
    return next();
});
app.get('/', (req, res) =>{
    res.send("Hello from me")
    console.log(`Time is ${req.myTime}`)
})
```

- External middleware: morgan. Helps logging http requests to console

```js
const morgan = require('morgan')
app.use(morgan('tiny'));
// output:
// GET / 304 - - 6.308 ms
// GET /dogs 304 - - 2.119 ms
```

### app.use
[Resource](https://expressjs.com/en/4x/api.html#app.use)

- Mounts the specified middleware function or functions at the specified path

```js
app.use('/dogs',(req, res, next)=>{
    console.log('dogs middleware');
    return next();
});
```

- Use when a request cannot be matched

```js
app.use((req, res)=>{
    res.status(404).send('Not found')
})
```

#### Fake Authentication

```js
app.use((req, res, next)=>{
    const {password} = req.query;
    //http://localhost:3000/?password=test
    if (password === 'test'){
        next();
    }
    res.send('Sorry wrong password')
});
```

- To protect only one route add middleware in the request

```js
const veryPassaword = (req, res, next)=>{
    const {password} = req.query;
    //http://localhost:3000/?password=test
    if (password === 'test'){
        next();
    }
    else{
        res.send('Sorry wrong password')
    }
};

app.get('/secret', veryPassaword, (req, res) =>{
    res.send('my secret')
})
```

