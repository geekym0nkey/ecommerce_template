# products/serializers.py
from rest_framework import serializers
from .models import Product,Order, OrderItem,ShippingAddress

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        # sellect all the fields
        fields = '__all__'

# Order Item Serializer
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        # Include all fields from the OrderItem Model
        fields = '__all__'
#ShippingAddress Serializer
class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        # Include all fields from the ShippingAddress Model
        fields = '__all__'
# Order Serializer
class OrderSerializer(serializers.ModelSerializer):
    shipping_address = ShippingAddressSerializer(source='shippingaddress',many=False, read_only=True)
    # Ensure that when fetching an Order, we also fetch the list of associated OrderItems
    order_items = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    # Custom method to retrieve the list of items within the Order
    def get_order_items(self, obj):
        # Retrieve all related OrderItem objects using the reverse relationship (orderitem_set)
        items = obj.orderitem_set.all()
        # Serialize these items using OrderItemSerializer, setting many=True for a list
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_user(self, obj):
        user = obj.user
        # return username here
        return {'id': user.id, 'username': user.username, 'email': user.email}