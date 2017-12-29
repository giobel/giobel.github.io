---
layout: post
title: Notes on Java
---

Thinking in Java 3rd edition

## Chapter 4

### Constructors

- Many C bugs occur when the programmer forgets to initialize a variable.
- Java has: 
  - Constructor: a special method automatically called when an object is created
  - Garbage Collector: automatically release memory
- if a class has a constructor -> Java automatically calls that constructor *when an object is created* -> initialization is guaranteed
- the name of the constructor is the same as the name of the class
- Style: 1st letter of all methods *lowercase*. 1st letter of all classes *Uppercase*

Workflow:
1. A new object is created:
```java
new Rock();
```
2. Storage is allocated and the constructor is called.
3. Like any method, the constructor can have args to allow you to specify how an obj is created.
```java
class Rock{
  Rock(int i) {
    System.out.println("Creating Rock number " + i);
  }
}
```

- Constructors eliminate a large class of problems and make the code easier to read.
- The constructor is an unusual type of method because it has no return value -> != from a **void** return value.
- Constructors returns nothing.

### Method Overloading

- When you create an object, you give a name to a region of storage.
- A method is a name for an action.
- Well-chosen names make it easier to understand your code.
- Human language can express a number of different meanings = it's *overloaded*.
