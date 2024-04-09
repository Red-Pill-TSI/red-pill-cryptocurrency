from django.db import models

# Create your models here.
class Currency(models.Models):
    price_open = models.FloatField()
    price_close = models.FloatField()
    price_highest = models.FloatField()
    price_lowest = models.FloatField()
    