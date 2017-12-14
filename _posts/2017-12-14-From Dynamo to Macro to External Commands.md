![_config.yml]({{ site.baseurl }}/images/macro1.png)

Dynamo is a good tool but scripts deployment, version compatibility, non OOTB nodes and the need to start Dynamo or to launch a script from the player can sometimes represent an obstacle.

For the most used nodes it may be worth to convert them into external commands or bespoke buttons in the toolbar.

The visual scripting process and the constant debugging (that can be done simply by checking the outputs of the individual nodes) represent a first step into proper coding. It helps to subdivide the problem into small chunks of code and to follow the flow of data, its transformation and its structure passing from one node to the other.

With this image in mind I think it's easier to write the same script in C#, in a macro first and then to create an external command in Visual Studio. The advantage of an external command over the other options is the accessibility from Revit through a keyboard shortcut, which increase the productivity and helps to develop a personal workflow in the creation of models or documentations.

This workflow is essential to adapt the software to the user needs and stimulating his creativity more than force him to adapt and follow actions created by others (software developer) that sometimes are convoluted or lack in immediacy.

Let's have a look at this script that places the active view on a selected sheet:
