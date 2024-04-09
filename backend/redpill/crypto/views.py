from django.shortcuts import render
from django.http import HttpResponse

def get_crypto(request):
    return HttpResponse("Hello world!")