---
title: Django Cookbook
layout: post
---

[VScode tutorial](https://code.visualstudio.com/docs/python/tutorial-django)

 - Create a project folder and inside add a project environment for Django
 ```python
python -m venv env
```

- Install Django in the virtual environment 
```python
python -m pip install django
```

- Create a Django Project
```python
django-admin startproject web_project .
```

To start the server:
```python
python manage.py runserver 1080
```

- Create a Django app
```python
python manage.py startapp hello
```

The folder contains:
- views.py: contains the functions that define pages in your web app
- models.py: contains classes defining your data objects 
- migrations folder: used by Django's administrative utility to manage database versions
- apps.py: app configuration
- admin.py: for creating an administrative interface
- tests.py: for unit tests

- add views
```python
from django.http import HttpResponse
def home(request):
    return HttpResponse("Hello, Django!")
```

- Create a file, hello/urls.py: specifies patterns to route different URLs to their appropriate views
```python
from django.urls import path
from hello import views

urlpatterns = [
    path("", views.home, name="home"),
]
```
map root URL of the app ("") to the view.home function that you just added to hello/views.py:

- The web_project folder also contains a urls.py file, which is where URL routing is actually handled
```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include("hello.urls"))
]
```