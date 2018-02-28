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

