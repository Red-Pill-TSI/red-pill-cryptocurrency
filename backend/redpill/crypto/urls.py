from django.urls import path
from . import views

urlpatterns = [
    path('crypto/', views.get_crypto),
]