from django.db import models
from django.conf import settings
# Create your models here.

# products/models.py
from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200, unique=True)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    brand = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    count_in_stock = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Order Model
class Order(models.Model):
    # User (ForeignKey: links the order to a user)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    
    # Price Calculations
    tax_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
    shipping_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
    
    # Order Status
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    
    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Displaying Order ID (or creation time)
        return str(self.created_at)


# Order Item Model (Individual product item within the cart/order)
class OrderItem(models.Model):
    # ForeignKey: Links to the main Order
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)
    # ForeignKey: Links to the Product Model (The item being bought)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    
    # Purchased item details
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
    
    # Image path (stored as backup to protect historical orders from product image changes)
    image = models.CharField(max_length=200, null=True, blank=True)
    
    def __str__(self):
        # Displaying product name and quantity
        return self.name


class ShippingAddress(models.Model):
    # OneToOneField: each order is paired by with one address
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank=True)

    # details of the address
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)

    # shipping (sometimes the shipping price changes so it has to be recorded individually)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return str(self.address)
# run migrate，convert this Model to a data sql like list 
# python manage.py makemigrations products
# python manage.py migrate
