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
- Because the constructor’s name is predetermined by the name of the class, there can be only one constructor name.
- *Method overloading* is essential to allow the same method name to be used with different argument types.
- Each overloaded method **must** take a unique list of argument types.
- Even differences in the ordering of arguments are sufficient to distinguish two methods: (Although you don’t normally want to take this approach, as it produces difficult-to-maintain code).
```java
class Tree {
  Tree (String s, int i) {
      System.out.println("String: " + s + ", int: " + i);
  }
  Tree (int i, String s) {
      System.out.println("int: " + i + ", String: " + s);
  }
}
```
**Watchout**

1. A primitive can be automatically promoted from a smaller type to a larger one and this can be slightly confusing in combination with overloading. You’ll see that the constant value 5 is treated as an int, so if an overloaded method is available that takes an int it is used. In all other cases, if you have a data type that is smaller than the argument in the method, that
data type is promoted. char produces a slightly different effect, since if it doesn’t find an exact char match, it is promoted to int.
*What happens if your argument is bigger than the argument expected by the overloaded method?*
You **must cast to the necessary type** using the type name in parentheses. If you don’t do this, the compiler will issue an error message. This is a narrowing conversion, which means you might lose information during the cast.

2. You cannot use return value types to distinguish overloaded methods.
```java
void f() {}
int f() {}
```
This works fine when the compiler can unequivocally determine the meaning from the context *however* you can also call a method and ignore the return value -> calling a method for its side effect:
```java
f();
```
Java can't determine which **f()** should be called. 

### Default constructors

- Default constructor is one without args, used to create a basic object. 
- If you create a class that has no constructors, the compiler will automatically create a default constructor for you.
- If you define any constructors (with or without arguments), the compiler will not synthesize one for you
```java
class Hat {
  Hat (int i) {}
  Hat (double d) {}
}

new Hat(); //The compiler will complaing that it cannot find a constructor that matches.
```
