---
layout: post
title: Notes on Java
---

[Bruce Eckel, Thinking in Java 3rd edition](http://www.mindview.net/Books/TIJ/)

# Table of Contents
1. Chapter 4
1.1 [Constructors](#Chapter 4)
1.2 [this keyword](#this)
1.3 [The meaning of static](#tms)
1.4 [Cleanup: finalization and garbage collection](#cleanup)
1.5 [How a garbage collector works](#garbage)
1.6 [Order of initialization](#order)
1.7 [Array initialization](#array)
1.8 [Summary](#summary)
2. [Chapter 5](#Chapter 5)

<a name="Chapter 4"></a>

# Chapter 4 
## Constructors

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

## Method Overloading

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
**Watch-out**

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

## Default constructors

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

<a name="this"></a>

## this keyword

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

## Calling constructors from constructors

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

<a name="tms"></a>
## The meaning of static

- It means that there is no this for that particular method.
- You cannot call non-static methods from inside static methods (although the reverse is possible). The one case in which this is possible occurs if you pass a reference to an object into the static method. Then, via the reference (which is now effectively this), you can call non-static methods and access non-static fields. But typically if you want to do something like
this you’ll just make an ordinary, non-static method.
- You can call a static method for the class itself without any object.
- With a static method you don’t send a message to an object, since there’s no this.

<a name="cleanup"></a>
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

<a name="garbage"></a>
## How a garbage collector works
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
2. Adaptive garbage collection scheme -> faster
- Any nondead object must ultimately be traceable back to a reference that lives either on the stack or in static storage.
- If you start in the stack and the static storage area and walk through all the references you’ll find all the live objects.
- There is no problem with detached self-referential groups—these are simply not found, and are therefore automatically garbage.

2.1 One of these variants is stop-and-copy.
- The program is first stopped
- Then, each live object that is found is copied from one heap to another, leaving behind all the garbage.
- As the objects are copied into the new heap they are packed end-to-end, thus compacting the new heap
There are two issues that make these so-called “copy collectors” inefficient:
- You have two heaps and you slosh all the memory back and forth between these two separate heaps, maintaining twice as much memory as you actually need.
- The second issue is the copying. Once your program becomes stable it might be generating little or no garbage. Despite that, a copy collector will still copy all the memory from one place to another, which is wasteful.

2.2 Mark and Sweep
- It’s what earlier versions of Sun’s JVM used all the time.
- For general use, mark and sweep is fairly slow, but when you know you’re generating little or no garbage it’s fast
- Each time it finds a live object that object is marked by setting a flag in it, but the object isn’t collected yet.
- Only when the marking process is finished does the sweep occur.
- During the sweep, the dead objects are released.
- No copying happens, so if the collector chooses to compact a fragmented heap it does so by shuffling objects around
- Mark-and-sweep requires that the program be stopped

*Adaptive generational stop-and-copy mark-and-sweep*: the JVM monitors the efficiency of GC and if it becomes a waste of time because all objects are long-lived then it switches to mark-and-sweep. Similarly, the JVM keeps track of how successful mark-and-sweep is, and if the heap starts to become fragmented it switches back to stop-and-copy.

There are a number of additional speedups possible in a JVM.
1. just-in-time (JIT) compiler: partially or fully converts a program into native machine code, so it doesn’t need to be interpreted by the JVM and thus runs much faster. 
One approach is to simply JIT all the code:
- it takes a little more time
- it increases the size of the executable (byte codes are significantly more compact than expanded JIT code) and this might cause paging, which definitely slows down a program.
2. lazy evaluation: the code is not JIT compiled until necessary. Thus, code that never gets executed might never get JIT compiled.
The Java HotSpot technologies in recent JDKs take a similar approach by increasingly optimizing a piece of code each time it is executed, so the more the code is executed, the faster it gets.

## Member initialization
Java goes out of its way to guarantee that variables are properly initialized before they are used.
1. variables that are defined locally to a method
```java
void f() {
int i;
i++; // Error -- i not initialized
}
```
Of course, the compiler could have given i a default value, but it’s more likely that this is a programmer error and a default value would have covered that up. Forcing the programmer to provide an initialization value is more likely to catch a bug.
2. If a primitive is a field in a class
Since any method can initialize or use that data, it might not be practical to force the user to initialize it to its appropriate value before the data is used. However, it’s unsafe to leave it with a garbage value, so each primitive field of a class is guaranteed to get an initial value.

## Specifying initialization
Assign the value at the point you define the variable in the class.
```java
class InitialValues {
boolean b = true;
char c = 'x';
byte B = 47;
short s = 0xff;
int i = 999;
long l = 1;
float f = 3.14f;
double d = 3.14159;
//. . .
```
You can also initialize nonprimitive objects in this same way.
```java
class Measurement {
Depth d = new Depth();
// . . .
```
You can even call a method to provide an initialization value:
```java
class CInit {
int i = f();
//...
}
```
This method can have arguments, of course, but those arguments cannot be other class members that haven’t been initialized yet.

## Constructor initialization
- The constructor can be used to perform initialization
- You aren’t precluding the automatic initialization, which happens before the constructor is entered
```java
class Counter {
  int i;
  Counter() {i - 7}
  // ...
 ```
 then i will first be initialized to 0, then to 7.

<a name="order"></a>
## Order of initialization
- Within a class, the order of initialization is determined by the order that the variables are defined within the class
- The variables are initialized before any methods can be called, even the constructor.
- The order of initialization is statics first, if they haven’t already been initialized by a previous object creation, and then the non-static objects.
**Summarize the process of creating an object:**
1. The first time an object of type Dog is created (the constructor is actually a static method), or the first time a static method or
static field of class Dog is accessed, the Java interpreter must locate Dog.class, which it does by searching through the classpath.
2. As Dog.class is loaded, all of its static initializers are run. Thus, static initialization takes place only once, as the Class object is loaded for the first time.
3. When you create a new Dog( ), the construction process for a Dog object first allocates enough storage for a Dog object on the heap.
4. This storage is wiped to zero, automatically setting all the primitives in that Dog object to their default values (zero for numbers and the equivalent for boolean and char) and the references to null.
5. Any initializations that occur at the point of field definition are executed.
6. Constructors are executed.

## Explicit static initialization
Java allows you to group other static initializations inside a special “static clause” (sometimes called a static block) in a class.
```java
class Spoon {
static int i;
static {
i = 47;
}
// . . .
```
It appears to be a method, but it’s just the static keyword followed by a block of code. This code, like other static initializations, is executed only once, the first time you make an object of that class or the first time you access a static member of that class (even if you never make an object of that class).
### Non-static instance initialization
```java
public class Mugs {
static Test monitor = new Test();
Mug c1;
Mug c2;
{
c1 = new Mug(1);
c2 = new Mug(2);
System.out.println("c1 & c2 initialized");
}
```
Looks exactly like the static initialization clause except for the missing static keyword.

<a name="array"></a>
## Array initialization
- An array is simply a sequence of either objects or primitives, all the same type and packaged together under one identifier name.
```java
int[] a1;
```
- The compiler doesn’t allow you to tell it how big the array is.
- All that you have at this point is a reference to an array, and there’s been no space allocated for the array
- To create storage for the array you must write an initialization expression:
```java
int[] a1 = { 1, 2, 3, 4, 5 };
```
- **length** = array's intrinsic member that you can query—but not change—to tell you how many elements there are in the array.
- What if you don’t know how many elements you’re going to need in your array while you’re writing the program? 
You simply use new to create the elements in the array.
```java
int[] a = new int[rand.nextInt(20)];
```
- Array elements of primitive types are automatically initialized to “empty” values. (For numerics and char, this is zero, and for boolean, it’s false.)
- If you’re dealing with an array of nonprimitive objects, you must always use new.

## Multidimensional arrays
```java
int[][] a1 = {
{ 1, 2, 3, },
{ 4, 5, 6, },
};
```
<a name="summary"></a>
## Summary
- Improper initialization of variables causes a significant portion of programming problems.
- similar issues apply to improper cleanup
- Because constructors allow you to guarantee proper initialization and cleanup, you get complete control and safety.
- In Java, the garbage collector automatically releases the memory for all objects
- The garbage collector does add a run-time cost, the expense of which is difficult to put into perspective because of the historical slowness of Java interpreters

<a name="Chapter 5"></a>

## Chapter 5
### Hiding the Implementation
