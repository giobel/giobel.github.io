---
layout: post
title: Notes on Java
---

[Bruce Eckel, Thinking in Java 3rd edition](http://www.mindview.net/Books/TIJ/)

# Table of Contents
4 [Chapter 4 - Initialization & Cleanup](#Chapter 4)
4.1 [Constructors](#Chapter 4)
4.2 [this keyword](#key)
4.3 [The meaning of static](#tms)
4.4 [Cleanup: finalization and garbage collection](#cleanup)
4.5 [How a garbage collector works](#garbage)
4.6 [Order of initialization](#order)
4.7 [Array initialization](#array)
4.8 [Summary](#summary)
5 [Chapter 5 - Hiding the Implementation](#Chapter 5)
5.1 [package: the library unit](#lunit)
5.2 [Creating unique package names](#unique)
5.3 [Collisions](#Collisions)
5.4 [A custom tool library](#custom)
5.5 [Java access specifiers](#access)
5.6 [Interface and Implementation](#interface)
5.7 [Class access](#classAccess)
5.8 [Summary](#ch5Summary)
6 [Chapter 6 - Reusing Classes](#Chapter 6)

<a name="Chapter 4"></a>

# Chapter 4 - Initialization & Cleanup
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
{% highlight java %}
new Rock();
{% endhighlight %}
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

<a name="key"></a>
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

# Chapter 5 - Hiding the Implementation

- Separate the things that change from the things that stay the same.
- Prticularly important for libraries: 
  - the user won't need to rewrite code if a new version comes out.
  - the library creator must have the freedom to make modifications and improvements.
To solve this problem Java provides *access specifiers*:
  - public
  - protected
  - private
As a library designer you want to keep everything as private as possible.
- **package** keyword: controls how components are bundled together into a cohesive unit (a library)

<a name="lunit"></a>
## package: the library unit
```java
import java.util.*
```
This brings in the entire utility library.
```java
import java.util.ArrayList
```
This brings in a single class.
- Importing provides a mechanism to manage *name spaces*: the names of all your class members are insulated from each other.
But what about the class names? Suppose you create a Stack class that is installed on a machine which already has a Stack class that’s written by someone else? -> see Dynamo issues.
- If you’re planning to create libraries or programs that are friendly to other Java programs on the same machine, you must think about preventing class name clashes.
- *compilation unit*: source-code file for Java:
  - must have a name ending in .java
  - inside there can be only one public class that must have the same name as the file (excluding .java)
  - additional classes are hidden (not public) and they comprise support classes for the main public class
- When you compile a .java file you get an output **for each class** in the .java file.
  - each output file has the name of a class in the .java file but with an extension of .class
- A working program is a bunch of .class files which can be packaged and compressed into a JAR file. The Java interpreter is responsible for finding, loading and interpreting these files. 
- A library is a group of these class files.
```java
package mypackage
```
- this compilation unit is part of a library named **mypackage**.
- naming convention: all lowercase letters, even for intermediate words.
```java
package mypackage;
public class MyClass {
// . . .
```
- the name of the file is MyClass.java (the only public class in that file)
- to use MyClass the user must use the import keyword or to give the fully qualified name
```java
mypackage.MyClass m = new mypackage.MyClass();
```
The import keyword can make this much cleaner:
```java
import mypackage.*
// ...
MyClass m = new MyClass();
```

<a name="unique"></a>
## Creating unique package names
- Since a package never really gets packaged into a single file, a package could be made up of many .class files
- Place all the .class files for a particular package into a single directory:
  - package names are unique
  - finds those classes that might be buried in a directory structure someplace: accomplished by encoding the path of the location of the .class file into the name of the package.
  - The first part of the package name is the Internet domain name of the creator of the .class, reversed
  - Since Internet domain names are guaranteed to be unique, if you follow this convention your package name will be unique
  - The second part of this trick is resolving the package name into a directory on your machine, so when the Java program runs and it needs to load the .class file it can locate the directory where the .class file resides.
The Java intepreter proceeds as follows:
1. finds the environment variable CLASSPATH
2. Starting at that root, the interpreter will take the package name and replace each dot with a slash to generate a path name from the CLASSPATH root (so package foo.bar.baz becomes foo\bar\baz)
3. This is then concatenated to the various entries in the CLASSPATH. That’s where it looks for the .class file with the name corresponding to the class you’re trying to create.
```java
package com.bruceeckel.simple;
public class Vector {
  public Vector() {
  /.../
  }
}
```
- com.bruceeckel is the name of the package and establishes my unique global name for my classes.
- a library named **simple** will be created.
- a class (therefore a .class file) Vector will be created.
```java
package com.bruceeckel.simple;
public class List {
  public List() {
  /.../
  }
}
```
- a class (therefore a .class file) List will be created.
Both of these files are placed in the subdirectory: C:\DOC\JavaT\com\bruceeckel\simple where CLASSPATH=.;D:\JAVA\LIB;C:\DOC\JavaT
- CLASSPATH can contain a number of alternative search paths.
- when using JAR files the name (not just the path) must be in the classpath: CLASSPATH=.;D:\JAVA\LIB;C:\flavors\grape.jar

<a name="collisions"></a>
## Collisions
```java
import com.bruceeckel.simple.*;
import java.util.*;
```
What happens if two libraries are imported via * and they include the same names?
- Sice java.util.* also contains a Vector class, this causes a potential collision. 
- As long as you don’t write the code that actually causes the collision, everything is OK.
- The collision does occur if you now try to make a Vector.
```java
Vector v = new Vector();
```
Which Vector class does this refer to?
The compiler complains and forces you to be explicit:
```java
java.util.Vector v = new java.util.Vector();
```
Since this (along with the CLASSPATH) completely specifies the location of that Vector, there’s no need for the import java.util.* statement unless I’m using something else from java.util.

<a name="custom"></a>
## A custom tool library
Consider, for example, creating an alias for System.out.println( ) to reduce typing.
```java
package com.bruceeckel.tools;
  public class P {
    public static void rint(String s) {
    System.out.print(s);
    }
    public static void rintln(String s) {
    System.out.println(s);
    }
  } ///:~
```
- You can use this shorthand to print a String either with a newline (P.rintln( )) or without a newline (P.rint( )).
- The location of this file must be in a directory that starts at one of the CLASSPATH locations, then continues com/bruceeckel/tools

## Using imports to change behavior
- A feature that is missing from Java is C’s conditional compilation, which allows you to change a switch and get different behavior without changing any other code.
- The reason such a feature was left out of Java is probably because it is most often used in C to solve cross-platform issues:
- A very common use is for debugging code: 
  - The debugging features are enabled during development, and disabled in the shipping product. 
  - You can accomplish this by changing the package that’s imported to change the code that’s used in your program from the debug version to the production version.

## Caveat
The package must live in the directory indicated by its name, which must be a directory that is searchable starting from the CLASSPATH.

<a name="access"></a>
## Java access specifiers
- Placed in front of each definition for each member in the class (field or method).
- Package access
  - If you give no access specifier at all, all the other classes in the current package have access to that member, but to all the classes outside of this package the member appears to be private. 
  - Allows to group related classes together in a package so that they can easily interact with each other.
- The only way to grant access to a member is to:
  - Make the member public.
  - An inherited class can access a protected member as well as a public membet (but not private members).
  - Provide accessor/mutator methods (get/set methods) that read and change the value.
## public: interface access
```java
package c05.dessert;
public class Cookie {
  public Cookie() {
  System.out.println("Cookie constructor");
  }
  void bite() { System.out.println("bite"); }
} ///:
```
 - Cookie.java must reside in a subdirectory called **dessert** in a directory under **c05** that must be under one of the CLASSPATH directories
 - If you create a program that uses Cookie, you can create a Cookie object.
 ```java
import c05.dessert.*;
public class Dinner {
  public Dinner() {
  System.out.println("Dinner constructor");
  }
    public static void main(String[] args) {
    Cookie x = new Cookie();
    //! x.bite(); // Can't access
    });
  }
} ///:~
```
 - The bite() member is inaccessible inside Dinner.java 
**The default package**
```java
class Cake {
  static Test monitor = new Test();
  public static void main(String[] args) {
    Pie x = new Pie();
    x.f();
    monitor.expect(new String[] {
    "Pie.f()"
    });
  }
} ///:~
```
In a second file, in the same directory:
```java
class Pie {
  void f() { System.out.println("Pie.f()"); }
} ///:~
```
Cake is able to create a Pie object and call its f( ) method.
- The reason that they are available in Cake.java is because they are in the same directory and have no explicit package name. 
- Java treats files like this as implicitly part of the “default package” for that directory.

## private: no access
- No one can access that member except the class that contains that member, inside methods of that class.
- Other classes in the same package cannot access private members.
- private allows you to freely change that member without concern that it will affect another class in the same package.
- The default package access often provides an adequate amount of hiding:
  - package-access member is inaccessible to the client programmer using the class
  - you might not initially think you’ll use the private keyword often since it’s tolerable to get away without it.
**The consistent use of private is very important, especially where multithreading is concerned.**
```java
class Sundae {
  private Sundae() {}
  static Sundae makeASundae() {
  return new Sundae();
  }
}
public class IceCream {
  public static void main(String[] args) {
   //! Sundae x = new Sundae();
   Sundae x = Sundae.makeASundae();
  }
} ///:~
```
- you cannot create a Sundae object via its constructor
- you must call the makeASundae( ) method to do it for you
- Unless you must expose the underlying implementation (which is a much rarer situation than you might think), you should make all fields private.
- However, just because a reference to an object is private inside a class doesn't mean that some other object can't have a public reference to the same object. 

## protected: inheritance access
- deals with a concept called inheritance, which takes an existing class—which we refer to as the base class—and adds new members to that class without touching the existing class.
- You can also change the behavior of existing members of the class.
- To inherit from an existing class (*base class*), you say that your new class extends an existing class
```java
class Foo extends Bar {
```
If you create a new package and inherit from a class in another package, the only members you have access to are the public members of the original package.
- Sometimes the creator of the base class would like to take a particular member and grant access to derived classes but not the world in general.
- protected also gives package access

<a name="interface"></a>
## Interface and implementation
*implementation hiding* : access control
*encapsulation* : wrapping data and methods within classes with implementation hiding
The result is a data type with characteristics and behaviors.
- Access control puts boundaries within a data type for two important reasons;
  - establish what the client programmers can and can’t use.
  - separate the interface from the implementation.
- In the world of object-oriented programming, where a class is actually describing “a class of objects,” as you would describe a class of fishes or a class of birds.
- Any object belonging to this class will share these characteristics and behaviors.
- In the original OOP language, Simula-67, the keyword class was used to describe a new data type.
**This is the focal point of the whole language: the creation of new data types that are more than just boxes containing data and methods.**
- For clarity, you might prefer a style of creating classes that puts the public members at the beginning, followed by the protected, package access, and private members.
- This will make it only partially easier to read because the interface and implementation are still mixed together.
- *Class browser* : look at all the available classess and show you what you can do with them (i.e. what members are available)

<a name="classAccess"></a>
## Class access
1. There can be only one public class per compilation unit (file). The idea is that each compilation unit has a single public interface represented by that public class. It can have as many supporting package-access classes as you want. If you have more than one public class inside a compilation unit, the compiler will give you an error message.
2. The name of the public class must exactly match the name of the file containing the compilation unit, including capitalization. So for Widget, the name of the file must be Widget.java. Again, you’ll get a compile-time error if they don’t agree. 
3. It is possible, though not typical, to have a compilation unit with no public class at all. In this case, you can name the file whatever you like.
- A class cannot be private (that would make it accessible to no one but the class), or protected.
- You have only two choices for class access: package access or public.
- If you don’t want anyone else to have access to that class, you can make all the constructors private, thereby preventing anyone but you, inside a static member of the class, from creating an object of that class.
```java
class Soup {
  private Soup() {
  public static Soup makeSoup() {   // (1) Allow creation via static method:
    return new Soup();
  }
  private static Soup ps1 = new Soup();  // (2) Create a static object and return a reference upon request (Singleton pattern)
  public static Soup access() {
    return ps1;
  }
  public void f() {}
}
class Sandwich { 
  void f() { new Lunch();
  }
}
public class Lunch {
  void test() {
  Soup priv2 = Soup.makeSoup();
  Sandwich f1 = new Sandwich();
  Soup.access().f();
  }
}
```
The word before the method name (access) tells what the method returns:
```java
public static Soup access() {
  return ps1;
  }
```
In this case it returns a reference to an object (a new data type).
- The class Soup shows how to prevent direct creation of a class by making all the constructors private.
- By writing the default constructor, it won’t be created automatically.
- By making it private, no one can create an object of that class.
How does anyone use this class?
1. a static method is created that creates a new Soup and returns a reference to it (if you want to keep count of how many Soup objects to create).
2. use a *design pattern*. In this case it is called "singleton" because it allows only a single object to ever be created.
  - The object of class Soup is created as a static private member of Soup, so there’s one and only one, and you can’t get at it except through the public method access().
  - If a static member of that class is public, the client programmer can still access that static member even though they cannot create an object of that class.

<a name="ch5Summary"></a>
## Summary
- A C programming project begins to break down somewhere between 50K and 100K lines of code because C has a single “name space,” so names begin to collide, causing an extra management overhead.
- In Java, the package keyword, the package naming scheme, and the import keyword give you complete control over names, so the issue of name collision is easily avoided.
- There are two reasons for controlling access to members:
  1. keep users’ hands off tools that they shouldn’t touch; tools that are necessary for the internal machinations of the data type
  2. to allow the library designer to change the internal workings of the class without worrying about how it will affect the client programmer.
- The public interface to a class is what the user does see, so that is the most important part of the class to get “right” during analysis and design.

<a name="Chapter 6"></a>
# Chapter 6 - Reusing Classes
