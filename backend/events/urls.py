from django.urls import path
from .views import *

urlpatterns = [
    path('signin/', signin, name='signin'),
    path('signup/', user_signup, name='signup'),
    path('admin/ai_description/', ai_description, name='ai_description'),
    path('admin/create_event/', create_event, name='create_event'),
]