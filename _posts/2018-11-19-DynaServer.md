---
title: Dissecting DynaServer
layout: post
---


[DynaSerer by Radu Gidei](https://github.com/radumg/DynaServer)

[Control Dynamo from the web](https://github.com/DynamoDS/DeveloperWorkshop/tree/master/CBW227911%20-%20Control%20Dynamo%20from%20the%20Web)

# References 

- Nancy
- Nancy.Hosting.Self

# Projects

## ServerLibrary

Class Library project


File: WebServer.cs

```csharp
namespace ServerLibrary
{
    public class WebServer
    {

            private const string DEFAULT_URL_BASE = "http://localhost:1234";
            private NancyHost server;

            public WebServer()
            {
                var serverConfig = new HostConfiguration();
                serverConfig.UrlReservations.CreateAutomatically = true;

                server = new NancyHost(serverConfig, new Uri(DEFAULT_URL_BASE));
            }

            public void Start()
            {
                server.Start();
                Process.Start("http://localhost:1234");
                Console.WriteLine("Server has now started." + Environment.NewLine);
            }

            public void Stop()
            {
                server.Stop();
                Console.WriteLine("Server has now stopped." + Environment.NewLine);
            }

    }
}
```

## NancyServer

Console App

File: Program.cs | Using ServerLibrary, launch the web server

```csharp
space NancyServer
{
    public class Program
    {
        static void Main(string[] args)
        {
            var server = new WebServer();
            server.Start();

            Console.WriteLine("Press any key to terminate server");
            Console.ReadKey();
            server.Stop();

            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();

        }
    }
```

Folder: Modules

File: IndexModule.cs | Server homepage

```csharp
using Nancy;
using System;
using System.Diagnostics;


namespace NancyServer
{
    public class IndexModule : NancyModule
    {
        public IndexModule() : base("/")
        {
            Get["/"] = x => {
                return "Hello, the server is now running. </br>" +
                "It is now " + DateTime.Now.ToLongTimeString();
                
            };
        }
    }
}
```

File: MathModule.cs | Define 4 routes

- /math  base route
- /math/pi returns PI
- /math/{number} returns the number. Define a private dynamic method
 
```csharp
using Nancy;
using System;


namespace NancyServer
{
    public class MathModule : NancyModule
    {
        public MathModule() : base("/math")
        {
            Get["/pi"] = x =>
           {
               return "Hello, PI is " + Math.PI;
           };

            Get["/echo/{number}"] = EchoNumber;
            Get["/square/{number}"] = SquareNumber;
            Get["/root/{number}"] = RootNumber;
        }

            private dynamic EchoNumber(dynamic parameters)
            {
                return "Your lucky number is " + parameters.number;
            }

        private dynamic SquareNumber(dynamic parameters)
        {
            double n;
            try
            {
                if (!double.TryParse(parameters.number, out n)) throw new Exception();
            }
            catch (Exception)
            {
                return "Could not parse number";
            }

            return "The square number is " + Math.Pow(n, 2);
            
        }

        private dynamic RootNumber(dynamic parameters)
        {
            return "The root number is " + Math.Sqrt(parameters.number);

        }

    }

}
```

Return a json object

```csharp
public TestModule() : base("/test")
{
    Get["/json"] = parameters => {
        var feeds = new string[] { "foo", "bar" };
        return Response.AsJson(feeds);
    };
}
```

Post something and return Html status (separate interface from implementation )

```csharp
public TestModule() : base("/test")
{
Post["/users/{id}"] = Users;
}

private dynamic Users(dynamic parameters)
{
    return "non va" + HttpStatusCode.OK;
}
```

Load an html page

Create a folder Views in NancyServer (the project where the server starts). Add the html files and set "Copy to output directory" to "Always"

```csharp
            Get["/"] = x =>
            {
                return Response.AsFile("Views/start.html", "text/html");
            };
```

Add stylesheets

```csharp

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css"></link>
    <link rel='stylesheet prefetch' href='https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.2/css/bulma.css'></link>
    <link rel='stylesheet prefetch' href='https://use.fontawesome.com/releases/v5.3.1/css/all.css'></link>
    <link rel='stylesheet prefetch' href='https://cdnjs.cloudflare.com/ajax/libs/prism/1.14.0/themes/prism.min.css'></link>
    <link rel="stylesheet" href="../css/cheatsheet.css"></link>

```


Add a textbox Input and a textbox Return to the html code

```csharp
<!-- Add node to canvas -->
      <div class="box">
        <div class="columns">
          <div class="column">
            <h4 id="addnode" class="title is-3">Square number</h4>
            Send the number to math/square/{number}
            <br /> <br />
          </div>
          <div class="column">
            <h6>Enter a number</h6>
            <div class="field">
              <input id="addNodeInput" class="input has-addons" type="text" placeholder="Type in name the number to square"></input>
              <br></br>
              <button class="button is-primary" onclick="addNode()">
                <span>Square!</span>
              </button>
              <br></br>
              <br></br>
              <em>Result :</em>
              <div class="notification">
                <button class="delete"></button>
                <div id="addNodeResult"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
```

Get the content of a textbox (addNodeInput). Send the GET request to the corresponding root

```csharp
function addNode() {
    var xhttp = new XMLHttpRequest();
    var node = document.getElementById("addNodeInput").value;

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("addNodeResult").innerHTML +=
                this.responseText + "</br>";
        }
    };

    var endpoint = "/Nodes/Add/" + node + "/";
    xhttp.open("GET", endpoint, true);
    xhttp.send();
}
```


Form

```csharp
<div class="column is-12">
<div class="container content">

<h1>Family Instance By Face</h1>

<container>

 <form>
  <div class="form-group">
    <legend for="inputAddress">Select Opening Family</legend>
    <select type="text" class="form-control" id="inputAddress">
	<option selected>Choose family...</option>
	<option>Family 1</option>
	<option>Family 2</option>
	<option>Family 3</option>
	</select>
  </div>
  <div class="form-row">
    <div class="form-group col-md-6">
      <legend for="inputEmail4">Width</legend>
      <input type="email" class="form-control" id="Width" placeholder="Enter the opening width">
    </div>
    <div class="form-group col-md-6">
      <legend for="inputPassword4">Height</legend>
      <input type="password" class="form-control" id="Height" placeholder="Enter the opening height">
    </div>
  </div>

        

		<legend class="row-form-label row-sm-2 pt-0">Position along the beam</legend>
<div class="form-check form-check-inline row-md-6">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Start Point">
  <label class="form-check-label" for="inlineRadio1">Start Point</label>
</div>
<div class="form-check form-check-inline row-md-6">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Mid Point">
  <label class="form-check-label" for="inlineRadio2">Mid Point</label>
</div>
<div class="form-check form-check-inline row-md-6">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="End Point">
  <label class="form-check-label" for="inlineRadio3">End Point</label>
</div>

       
	  <div class="form-group">
    <legend for="inputAddress2">Offset</legend>
    <input type="text" class="form-control" id="inputAddress2" placeholder="Opening offset">
  </div>

  <button type="submit" class="btn btn-primary">Place Void</button>
</form>

</div>
</div>

```