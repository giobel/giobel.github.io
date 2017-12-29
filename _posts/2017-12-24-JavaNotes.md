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

new Hat(); //The compiler will complain that it cannot find a constructor that matches.
```

### this keyword

- You have 2 objects of the same type called a and b. How can you call a method f() for both?
```java
class Banana {
  void f(int i) {
    /* ... */
  }
}

Banana a = new Banana();
Banana b = new Banana();

a.f(1);
a.f(2);
```
- There’s a secret first argument passed to the method f() and that argument is the reference to the object that’s being
manipulated.
```java
Banana.f(a,1);
Banana.f(b,2);
```
This is internal and you can't write these expressions and get the compiler to accept them.
Suppose you’re inside a method and you’d like to get the reference to the current object:
- Since that reference is passed secretly by the compiler, there’s no identifier for it.
- The **this** keyword produces the reference to the object the method has been called for.
- The **this** keyword can be used only inside a method.
- if you’re calling a method of your class from within another method of your class, you don’t need to use this. You simply call the method. The current this reference is automatically used for the other method:
```java 
class Apricot {
  void pick() {
  /* ... */
  }
  void pit() {
  pick();
  /* ... */
  }
}
```
inside pit() you could say this.pick() but the compiler does it for you automatically.
The **this** keyword it's often used in return statements when you want to return the reference to the current object.
```java
public class Leaf {
  int i = 0;
  Leaf increment() {
      i++;
      return this;
  }
}
```
Because increment() returns the reference to the current object via the this keyword, multiple operations can easily be performed on the same object.

### Calling constructors from constructors

When you write several constructors for a class, there are times when you’d like to call one constructor from another to avoid duplicating code. You can make such a call using the this keyword. 

In a constructor, the this keyword takes on a different meaning when you give it an argument list: it makes an explicit call to the
constructor that matches that argument list.

```java
public class Flower {
    int petalCount = 0;
    String s = new String("null");
    Flower (int petals) {
        petalCount = petals;
    }
    Flower (String ss) {
        s = ss;
    }
    Flower (strinig s, int petals) {
    this(petals);
    //! this(s); // Can't call two!
    this.s = s; // Another use of "this"
    }
    Flower() {
    this("hi", 47);
    }
}
```
- The constructor Flower(String s, int petals) shows that, while you can call one constructor using this, you cannot call two. 
- The constructor call must be the first thing you do or you’ll get a compiler error message.
- Since the name of the argument s and the name of the member data s are the same, there’s an ambiguity. You can resolve it by saying this.s to refer to the member data.

### The meaning of static

- It means that there is no this for that particular method.
- You cannot call non-static methods from inside static methods (although the reverse is possible). The one case in which this is possible occurs if you pass a reference to an object into the static method. Then, via the reference (which is now effectively this), you can call non-static methods and access non-static fields. But typically if you want to do something like
this you’ll just make an ordinary, non-static method.
- You can call a static method for the class itself without any object.
- With a static method you don’t send a message to an object, since there’s no this.

## Cleanup: finalization and garbage collection

- Java has the garbage collector to reclaim the memory of objects that are no longer used.
- Simply letting go of an object once you are done with it is not always safe.
- Java has the garbage collector to reclaim the memory of objects that are no longer used.
Consider an unusual case:
- your object allocates "special" memory without using new
- the garbage collector knows only how to release memory allocated with new -> it won't know how to release the object's special memory
To handle this case Java provides a method called finalize() that you can define for your class.
When the garbage collector is ready to release the storage it will first call finalize() and only on the next garbage-ollection pass will it reclaim the object's memory.
Put another way:
1. Your objects might not get garbage-collected.
2. Garbage collection is not destruction.
If there is some activity that must be performed before you no longer need an object, you must perform that yourself.
- Java has no destructor or similar concept -> you must create an ordinary method to perform this clanuo.
3. Garbage collection is only about memory.
- The sole reason of garbage collection is to recover memory that your program is no longer using.
- finalize( ) is in place because of the possibility that you’ll do something C-like by allocating memory using a mechanism other than the normal one in Java. This can happen primarily through native methods, which are a way to call non-Java code from Java.
- To clean up an object, the user of that object must call a cleanup method at the point the cleanup is desired.
- In C++, all objects are destroyed. Or rather, all objects should be destroyed.
- Java doesn’t allow you to create local objects
— You must always use new. But in Java, there’s no “delete” to call to release the object since the garbage collector releases the storage for you.
In general, you can’t rely on finalize( ) being called, and you must create separate “cleanup” methods and call them explicitly. So it appears that finalize( ) is only useful for obscure memory cleanup that most programmers will never use.

There is a very interesting use of finalize( ) which does not rely on it being called every time. This is the
verification of the *termination condition* of an object.
At the point that you’re no longer interested in an object—when it’s ready to be cleaned up—that object should be in a state whereby its memory can be safely released. For example, if the object represents an open file, that file should be closed by the programmer before the object is garbagecollected.

### How a garbage collector works
- The garbage collector can have a significant impact on increasing the speed of object creation.
- This might sound a bit odd at first: storage release affects storage allocation: allocating storage for heap
objects in Java can be nearly as fast as creating storage on the stack in other languages.
- In some JVMs, the Java heap is quite different; it’s more like a conveyor belt that moves forward every time you
allocate a new object. This means that object storage allocation is remarkably rapid.
- You might observe that the heap isn’t in fact a conveyor belt: The trick is that the garbage collector steps in and while it collects the garbage it compacts all the objects in the heap so that you’ve effectively moved the “heap pointer” closer to the beginning of the conveyor belt and further away from a page fault.
Garbage collector (GC) schemes:
1. Reference counting
- Each object contains a reference counter, and every time a reference is attached to an object the reference count is increased.
- Every time a reference goes out of scope or is set to null, the reference count is decreased.
- The garbage collector moves through the entire list of objects and when it finds one with a reference count of zero it releases that storage.
- The one drawback is that if objects circularly refer to each other they can have nonzero reference counts while still being garbage.
Reference counting is commonly used to explain one kind of garbage collection but it doesn’t seem to be used in any JVM implementations.
