---
title: Connect Revit to the Web
layout: post
---

A cookbook made from [The 3D Web Coder](http://the3dwebcoder.typepad.com/)website by Jeremy Tammik

[Index here](https://jeremytammik.github.io/3dwc/)

[How to use Node and NPM without installation or admin rights - Shravan Kumar Kasagoni](http://theshravan.net/blog/how-to-use-node-and-npm-without-installation-or-admin-rights/)


Ingredients:

- [Brackets](http://brackets.io/) open source text editor. Live preview on browser. 

- Node.js open source, cross-platform JavaScript runtime environment. Use it to build a web server.

Tutorials and Workshops: 
```python
 $ npm install -g learnyounode
 $ npm install -g introtowebgl
```

Installation
[How to use Node and NPM without installation or admin rights -  Shravan Kumar Kasagoni](http://theshravan.net/blog/how-to-use-node-and-npm-without-installation-or-admin-rights/)

1. Get node binary (node.exe) from nodejs.org site
2. Get the NPM
3. Copy npm.cmd beside the node.exe
4. Configure the PATH
5. Verify the setup. Go to command line then type node -v then npm -v. 


not working:
- Pipenv
- pip install --user nodejs

Recipes

## The Node.js Server Platform

nodejs Hello World
```python
  var http = require('http');

  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
  }).listen(1337, '127.0.0.1');

  console.log('Server running at http://127.0.0.1:1337/');
```
Run the server
```python
  % node example.js
  Server running at http://127.0.0.1:1337/
```

## Http-server

One of the very easiest ways to create a web server with no code whatsoever is to make use of [http-server](https://github.com/indexzero/http-server), a simple zero-configuration command-line HTTP server.
1. Set up Node.js http-server server:
```python
npm install http-server -g
```
2. Put your files in your folder
3. Start your local node http-server server:
```python
[sudo] http-server <myfolder>
```

### Implementing a Word Jumbling JavaScript Driven HTML Form

```html
<html>
<head>
<meta http-equiv="Content-Script-Type" content="text/javascript">
<script>
function jumble(word) {

  // Cache word length for easy looping
  var n = word.length;

  // Rand function will return 2-part array
  // [0] -> Index of rand, [1] -> random found value (from args)
  var rand = function(){
    var myRand = Math.floor(Math.random() * arguments.length);
    return [myRand, arguments[myRand]];
  };

  // Split passed word into array
  word = word.split('');

  // Prepate empty string for jumbled word
  jumbled = '';

  // Get array full of all available indexes:
  // (Reverse while loops are quickest: http://reque.st/1382)
  arrIndexes = [];
  var i = n;
  while (i--) {
    arrIndexes.push(i);
  }

  i = n;
  while (i--) {
    // Get a random number, must be one of
    // those found in arrIndexes
    var rnd = rand.apply(null,arrIndexes);
    // Append random character to jumbled
    jumbled += word[rnd[1]];
    // Remove character from arrIndexes
    // so that it is not selected again:
    arrIndexes.splice(rnd[0],1);
  }

  // Return the jumbled word
  return jumbled;
}

function jumble_one(word) {
  var n = word.length;
  if( 2 < n )
  {
    word = word[0] + jumble(word.slice(1,n-1)) + word[n-1];
  }
  return word;
}

function jumble_many_map(words) {
  jumbled = words.split(' ').map(jumble_one);
  return jumbled.join(' ');
}

function jumble_form(f)
{
  f.output.value = jumble_many_map(f.input.value);
}
</script>
</head>

<body>
  <form onSubmit="submit()">
    <p>Input words to jumble (no punctuation):</p>
    <textarea name="input" rows="5" cols="30">Type text here</textarea>
    <br/>
    <input value="Jumble words" type="button" onClick="jumble_form(this.form)" />
    <p>Output jumbled words:</p>
    <textarea name="output" rows="5" cols="30" readonly="readonly">Result text here</textarea>
  </form>
</body>
</html>
```