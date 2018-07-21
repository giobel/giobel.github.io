---
title: Threejs Cookbook
layout: post
---

##Based on Lynda course [Learning 3D Graphics on the Web with Three.js by Engin Arslan](https://www.lynda.com/JavaScript-tutorials/Introduction-three-js/586668/633290-4.html)

##Set the scene
```properties
function init() {

var scene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
//anti-div
document.getElementById('webgl').appendChild(renderer.domElement);

renderer.render(scene,camera);

return scene;
}
```
