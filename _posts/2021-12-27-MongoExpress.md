---
title: 7. Mongoose + Express
layout: post
date: 21/12/27
---

### Mongoose + Express

1. Empty app

    `npm init -y`

2. install express, ejs and mongoos

3. create folder *views* and *index.js*

4. add *express* and *mongoose*

```js
const express = require ('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/shopApp'); //create a db named test
  console.log('connection open')
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(3000, () =>{
    console.log('app is listening on port 3000')
})

app.get('/dog', (req, res)=>{
    res.send('woof')
})
```

5. create folder *models* and *product.js*

```js
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['fruit','vegetable', 'dairy']
    }
})

const Product = mongoose.model('Product', productSchema) //creates a collection named movies

module.exports = Product;
```

6. create some dummy data in *seed.js*

```js
const mongoose = require('mongoose');
const Product = require('./models/product');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/farmStand'); //create a db named test
  console.log('connection open')
}

const seedProducts = [
{   name: 'eggplan',
    price: 1.00,
    category: 'vegetable'
},
{   name: 'melon',
    price: 4.99,
    category: 'fruit'
},
{   name: 'watermelon',
    price: 4.99,
    category: 'fruit'
},
{   name: 'celery',
    price: 3.99,
    category: 'vegetable'
},
{   name: 'chocolate milk',
    price: 1.50,
    category: 'dairy'
},
{   name: 'cheese',
    price: 7.99,
    category: 'dairy'
}
]

Product.insertMany(seedProducts)
.then(res => console.log(res))
.catch(e => console.log(e))
```
7. run `node seed.js` to save the data in the database

8. check the data has been saved

    `show dbs`

    `use farmStand`

    `show collections`

    `db.products.find()`

9. setup a route to display the products

```js
app.get('/products', async (req, res)=>{
    const products = await Product.find({})
    //res.send('all products will be here')
    res.render('products/index', {products})
})
```

10. create a folder *products* in views and *index.ejs* 


```html
{% raw %}
<body>
    <h1>All Products</h1>
    <ul>
        <% for (let product of products){%>
            <li> <%= product.name %> </li>
        <% } %>
    </ul>
</body>
{% endraw %}
```



11. setup a show route using find by id

```js
app.get('/products/:id', async (req, res) => {
  const {id} = req.params;
  const product = await Product.findById(id);
  //res.send('details page')
  //console.log(product);
  res.render('products/show', {product})
})
```

12. *show.ejs*

```html
{% raw %}
<body>
    <h1><%= product.name %></h1>
    <ul>
        <li>Price: <%= product.price %></li>
        <li>Category: <%= product.category %></li>
    </ul>
</body>
{% endraw %}
```

13. add links in the index page

```html
{% raw %}
    <ul>
        <% for (let product of products){%>
            <li> <a href="/products/<%= product._id %>"><%= product.name %></a> </li> 
        <% } %>
    </ul>
    {% endraw %}
```

14. add new form

```html
    <h1>Add Product</h1>
    <form action="/products" method="POST">
        <label for="name">Product Name</label>
        <input type="text" name="name" id="name" placeholder="product name">
        <label for="price">Price</label>
        <input type="number" name="price" id="price" placeholder="product price">
        <label for="category">Category</label>
        <select name="category" id="category">
            <option value="fruit">fruit</option>
            <option value="vegetable">vegetable</option>
            <option value="dairy">dairy</option>
        </select>
        <button>Submit</button>
    </form>
```

```js
//parse response
app.use(express.urlencoded({extended: true}))

app.get('/products/new', (req, res) => {
  res.render('products/new')
})

app.post('/products', async (req, res) =>{
  const newProduct = new Product(req.body)
  await newProduct.save();
  console.log(newProduct);
  res.redirect(`/products/${newProduct._id}`);
})
```

15. Updating products - install method-override

```js
const methodOverride = require ('method-override')
app.use(methodOverride('_method'));
```

```html
    <form action="/products/<%= product._id%>?_method=PUT" method="POST">
```

```js
app.get('/products/:id/edit', async (req, res)=>{
  const {id} = req.params;
  const product = await Product.findById(id)
  res.render('prodcuts/edit', {product})
})
```

16. update data in mongoose db

```js
app.put('/products/:id', async (req, res)=>{
  const {id} = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
  res.redirect(`/products/${product._id}`);
})
```

```html
{% raw %}
    <a href="/products/<%= product._id %>/edit">Edit</a>
{% endraw %}
```

17. Fix category selector in *edit.js* page

```html
{% raw %}
   <option value="fruit" 
   <%=product.category === 'fruit' ? 'selected' : ''%>
   >fruit</option>
   {% endraw %}
```

Best to use a loop:

- In index.js create a list of categories and pass it to the *new.ejs* and *edit.js* routes:

```js
const categories = ['fruit', 'vegetable', 'dairy', 'fungi'];

app.get('/products/new', (req, res) => {
  res.render('products/new', {categories})
})

app.get('/products/:id/edit', async (req, res)=>{
  const {id} = req.params;
  const product = await Product.findById(id)
  res.render('products/edit', {product, categories})
})

```

- Create a loop in *new.js*

```html
{% raw %}
<select name="category" id="category">
            <%for(let category of categories){%>
                <option value="<%= category %>"><%= category %></option>
            <%}%>
        </select>
{% endraw %}
```

- and another one in the *edit.js*

```html
{% raw %}
<select name="category" id="category">
            <%for(let category of categories){%>
                <option value="<%= category %>" <%= product.category === category ? 'selected' : '' %>
                    ><%= category %></option>
            <%}%>
</select>
{% endraw %}
```

18. Delete products

```html
{% raw %}
    <form action="/products/<%=product._id%>?_method=DELETE" method="POST">
        <button>Delete</button>
    </form>
{% endraw %}
```

```js
app.delete('/products/:id', async (req, res)=>{
  const {id} = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  res.redirect('/products/');
})
```

19. Filter by Category

- Add a link to the category value in the *show.ejs* page

```html
   <li>Category: <a href="/products/?category=<%=product.category%>"><%=product.category%></a></li>
```
- index.js

```html
{% raw %}
    <% if(category !== 'All') { %>
    <a href="/products">All products</a>
    <%}%>
    {% endraw %}
```

```js
app.get('/products', async (req, res)=>{
    const {category} = req.query;
    if (category){
      const products = await Product.find({category});
      res.render('products/index', {products, category})
    }
    else{
      const products = await Product.find({})
      res.render('products/index', {products, category: 'All'})
    }
})
```