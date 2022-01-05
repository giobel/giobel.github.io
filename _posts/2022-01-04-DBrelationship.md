---
title: 10/ Data relationship with Mongo
layout: post
date: 22/01/04
---

### One to Many relationship
Users table - Posts table (1 user can have more posts)

### Many to Many
Movies table - Actors table (more than 1 actor in each movie)
We need a third table: Movie_id - Actor_id

### Using Mongo

#### One to Few
- Embed data in the document

```js
const userSchema = new mongoose.Schema({
    fisrtname: String,
    lastname: String,
    //address will be give an id by mongo
    //to disable the id:
    // _id: {id:false}
    address: [
        { 
          city: String, 
          address: String,
          state: {
              type: String,
              required: true 
              }
        }
    ]
})
```

### One to Many

- Create a separate model and store the ObjectId in the table
- Create a farm that contains a list of products (using their ObjectIds):

```js
const {Schema} = mongoose;

const farmSchema = new Schema({
  name: String,
  city: String,
  products: [
    {type: Schema.Types.ObjectId, ref: 'Product'}
  ]
})

const Farm = mongoose.model('Farm', farmSchema)


const makeFarm = async() => {
  const farm = new Farm({name: 'Fruit Belly', city: 'Guinda, CA'});
  await farm.save();
  console.log(farm)
}

makeFarm();

const addProduct = async()=>{
  const farm = await Farm.findOne({name: 'Fruit Belly'});
  const pera = await Product.findOne({name: 'Pera'});
  farm.products.push(pera);
  const melon = await Product.findOne({name: 'Melon'});
  farm.products.push(melon);

  farm.save();
}

addProduct();
```

Output:

```js
{   "_id" : ObjectId("61d5a9bc88904bbe0c9b8cef"), 
    "name" : "Fruit Belly", 
    "city" : "Guinda, CA", 
    "products" : [ ObjectId("61d5a77b333943a74ff12755"), ObjectId("61d5a77b333943a74ff12756"), ObjectId("61d5a77b333943a74ff12755") ], 
    "__v" : 1 
}
```

- To display the products value inside the array we need to use `populate`

```js
Farm.findOne({name: 'Fruit Belly'})
.populate('products')
.then(farm => console.log(farm));
```

Output:

```js
{
  _id: new ObjectId("61d5a9bc88904bbe0c9b8cef"),
  name: 'Fruit Belly',
  city: 'Guinda, CA',
  products: [
    {
      _id: new ObjectId("61d5a77b333943a74ff12755"),
      name: 'Melon',
      price: 4.99,
      category: 'fruit',
      __v: 0
    },
    {
      _id: new ObjectId("61d5a77b333943a74ff12756"),
      name: 'Pera',
      __v: 0
    }
  ],
        _id: new ObjectId("61d5a77b333943a74ff12755"),
      name: 'Melon',
      price: 4.99,
      category: 'fruit',
      __v: 0
    },
  __v: 1
}
```

### One to Many (Thousands)

- More efficient to store the parent id to the child (i.e. store the user into a tweet, than all the tweets into an user)

```js
const userSchema = new Schema({
  username: String,
  age: Number
})

const tweetSchema = new Schema({
  text: String,
  likes: Number,
  user: {type: Schema.Types.ObjectId, ref: 'User' }
})

const User = mongoose.model('User', userSchema);
const Tweet = mongoose.model('Tweet',tweetSchema);

const makeTweets = async () =>{
  const u1 = new User({username: 'chichi', age:'39'})
  //const u1 = await User.findOne({name: 'chichi'});
  const tw1 = new Tweet({text:'my first tweet', likes: 22, user: u1});
  //const tw2 = new Tweet({text:'my second tweet', likes: 12, user: u1});
  u1.save();
  tw1.save();
  //tw2.save();
}

makeTweets();

const findTweets = async ()=>{
  const t = await Tweet.findOne({text: 'my first tweet'}).populate('user', 'username')//retrieve only the username
  console.log(t);
}

findTweets();
```