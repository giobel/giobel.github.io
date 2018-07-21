---
title: Threejs Cookbook
layout: post
---

## Based on Lynda course [Learning 3D Graphics on the Web with Three.js by Engin Arslan](https://www.lynda.com/JavaScript-tutorials/Introduction-three-js/586668/633290-4.html)

## Set the scene

```properties
function init() {
    var scene = new THREE.Scene();
    
    var renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    //anti-div
    document.getElementById('webgl').appendChild(renderer.domElement);
    
    renderer.render(scene,camera);
    
    return scene;\
  }
var scene = init();
```
*return scene* allows to interrogate the scene object in the browser console (simply call **scene** from the console).
The scene is rendered just once. In order to render the scene continuously we need to use the requestAnimationFrame() function.

## Create and Add an object to the scene

```properties
function getBox(w,h,d){
    var geometry = new THREE.BoxGeometry(w,h,d);
    
    var material = new THREE.MeshBasicMaterial({color:0xff0000});
    
    var mesh = new THREE.Mesh(geometry, material);
    
    return mesh; }
```
The object by default is positioned at 0,0,0 (y direction = height)

## Create a camera
```properties
var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,1000);

camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 5;

camera.lookAt(new THREE.Vector3(0,0,0));
```
The camera by default is positioned at 0,0,0. You'll need to move it in order to see the geometry.