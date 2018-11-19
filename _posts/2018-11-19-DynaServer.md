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

WebServer.cs

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

