from django.urls import path
from .views import *

urlpatterns = [
    path('admin/signin/', admin_signin, name='admin_signup'),
]