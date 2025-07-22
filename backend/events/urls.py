from django.urls import path
from .views import *

urlpatterns = [
    path('signin/', signin, name='signin'),
    path('signup/', user_signup, name='signup'),
    path('admin/ai_description/', ai_description, name='ai_description'),
    path('admin/create_event/', create_event, name='create_event'),
    path('events/', get_events, name='get_events'),
    path('admin/admin_events/',admin_events,name='admin_events'),
    path('user/events/<str:id>/', get_event_by_id, name='get_event_by_id'),
]