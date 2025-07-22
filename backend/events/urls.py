from django.urls import path
from .views import *

urlpatterns = [
    path('signin/', signin, name='signin'),
    path('signup/', user_signup, name='signup')
]