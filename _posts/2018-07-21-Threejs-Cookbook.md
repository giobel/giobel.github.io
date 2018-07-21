---
title: Threejs Cookbook
layout: post
---

## Based on Lynda course [Learning 3D Graphics on the Web with Three.js by Engin Arslan](https://www.lynda.com/JavaScript-tutorials/Introduction-three-js/586668/633290-4.html)

## Create a camera

```properties
var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,1000);

camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 5;

camera.lookAt(new THREE.Vector3(0,0,0));
```
The camera by default is positioned at 0,0,0. You'll need to move it in order to see the geometry.

## Create and Add an object to the scene

```properties
function getBox(w,h,d){
    var geometry = new THREE.BoxGeometry(w,h,d);
    
    var material = new THREE.MeshBasicMaterial({color:0xff0000});
    
    var mesh = new THREE.Mesh(geometry, material);
    
    return mesh; }
```
The object by default is positioned at 0,0,0 (y direction = height)

## Set the scene and the renderer

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
var scene = init();
```
*return scene* allows to interrogate the scene object in the browser console (simply call **scene** from the console).
The scene is rendered just once. In order to render the scene continuously we need to use the requestAnimationFrame() function.

```properties
    function update (renderer, scene, camera){

        renderer.render(scene, camera);

        requestAnimationFrame(function(){
            update(renderer,scene,camera);
        })

    }
```

and in the init() function, don't use the renderer but the update function
```properties
//renderer.render(scene,camera);
update(renderer, scene, camera);
```

Now if we set scene.visible = false from the console, the scene will become black. Continuously rendering will allow real time interaction and animation possibilities.

Call **geometry.parameters** to sccess the parameters of an object:
```properties
box.position.y = box.geometry.parameters.height/2;
```

## Common object properties

- Children 
- Parent

The Scene is the parent object. Objects can be added inside other objects (for logical grouping, shared the transformation of the parent object).

Instead of adding the box to the scene we can add the box to the plane. If the plane moves the box (child of the plane) will move as well.

###Objects can have a name so that can then be found by getObjectByName method on the parent object.
Inside the init() function:
```properties
plane.name = 'plane-1';
```
Inside the update function:
```properties
  var plane = scene.getObjectByName('plane-1');
        plane.rotation.y += 0.001;
        plane.rotation.z +=0.001;
```
This will make the plane and the box to rotate.

### Traverse Method
Apply a transformation to all the children of an object:
```properties
       scene.traverse(function(child){
            child.scale.x +=0.001;
        })
```

### Adding fog to the scene

fog allows to fade the scene to a color. Two types of fog: FogExp2
```properties
//color and density
scene.fog = new THREE.FogExp2(0xffffff,0.2);
//make plane bigger
var plane = getPlane(20);
//color arg
renderer.setClearColor(0xffffff);
```

Color definition
```properties
//renderer.setClearColor(0xffffff);
//renderer.setClearColor('#ffffff');
renderer.setClearColor('rgb(255,255,255)');
```

### Shading and materials
MeshPhongMaterial


###Lights
```properties
function getPointLight(intensity){
    var light = new THREE.PointLight(0xffffff,intensity);
    return light;
}
```

Add a sphere as child of the light to visualize its position.

### dat.gui create user interface (dat.gui.min.js)

```properties
var gui = new dat.GUI();

pointLight.position.y = 2;
pointLight.intensity = 2;
//min and max value
gui.add(pointLight,'intensity',0,10);
gui.add(pointLight.position,'y',0,10);
gui.add(pointLight.position,'x',-10,10);
```

###orbit controls
In the init() function:
```properties
var controls = new THREE.OrbitControls(camera, renderer.domElement);
update(renderer, scene, camera, controls);
```
and in the update() function:
```properties
    function update (renderer, scene, camera, controls){

        renderer.render(scene, camera);

        controls.update();

        requestAnimationFrame(function(){
            update(renderer,scene,camera, controls);
        })

    }
```