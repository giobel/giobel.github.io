---
title: Using Python Functions and Classes
layout: post
---

## Using functions and classes to simplify iterations and organize data in objects instead of lists.

Example 1: Find beam closest Grids

```python
class GridPoint:
	pass
#create an instance and add values
instance = GridPoint()
instance.pt = Point.ByCoordinates(0,0)
instance.Name = "1A"
```

```python
class GridPoint:
	def __init__(self):
		self.Point = None
		self.Name = None
		self.vGrid = None
		self.hGrid = None
#create an instance and add values
instance = GridPoint()
instance.point = Point.ByCoordinates(0,0)
instance.name = "1A"
```

The 2 method above do not prevent mistakes by the user in the a variable name. To force value into pre-established variables:
```python
class GridPoint:
	def __init__(self, point, name, vGrid, hGrid):
		self.pt = point
		self.n = name
		self.vG = vGrid
		self.hG = hGrid
#create an instance using the provided constructor
instance = GridPoint(Point.ByCoordinates(0,0),"1A","1","A")
```

Instances can be created inside a loop and appended to a list. Values of an instance can be changed after its creation:

```python
list= []
for vGrid in IN[0]:
	for hGrid in IN[1]:
		instance = GridPoint(None, str(vGrid)+str(hGrid),vGrid, hGrid)
		list.append(instance)

for l,p in zip(list, IN[2]):
	l.Point = p
```



Context: Check that the openings in a beam are consistent with a typical detail

<img src="/images/class01.PNG" width="900" style="display:block; margin-left: auto; margin-right: auto;">

To check the openings we will need a list including the opening width and depth, its centroid, the beam height, the beam start and end point.

This can be achieved through a nested for loop:

```python

``` 
