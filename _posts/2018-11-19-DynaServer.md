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
