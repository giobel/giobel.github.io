---
title: JS Cookbook Notes
layout: post
---

### Console

`console.warn(object)` 
Similar to console.log(), but outputs text with a yellow background.
`console.error(object)` 
Similar to console.log(), but outputs text with a red background. It’s typically used to log error objects.
`console.assert(expression, object)` 
If the expression is false, the message is written to the console along with a stack trace.
`console.trace()` 
Displays a stack trace.
`console.count(label)`
Displays the number of times you’ve called this method with this label.
`console.dir(object)`
Displays all the properties of an object in an expandable, tree-like list.
`console.group()`
Starts a new group with the title you supply. The following console messages are indented underneath this heading, so they appear to be part of one logically related section. You use console.groupEnd() to end the group.
`console.time(label)`
Starts a timer with a label you use to identify it.
`console.timeEnd(label)`
Stops the timer associated with the label and displays the elapsed time.

```js
{
  const testValue = 40+12;
  console.log(testValue);
}
```
Enclose your entire block of code in an extra set of braces to create a new naming scope. You can then safely run the code multiple times, because each time a new context is created (and then discarded).

`use strict`
Using Strict Mode to Catch Common Mistakes


### NPM

#### Create a package.json file before downloading any package
`npm init -y`
The -y parameter (for yes) means that npm will simply choose default values

#### See all the global npm packages installed on your computer:
`npm list -g --depth 0`

