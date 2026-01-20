from django.shortcuts import render

# Create your views here.

# products/views.py
from rest_framework import viewsets
from .models import Product, Order, OrderItem,ShippingAddress
#from .serializers import ProductSerializer
from rest_framework.decorators import api_view, permission_classes,authentication_classes #all the decorators need to get imported properly  
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, serializers #serializer is here 
from rest_framework.authentication import SessionAuthentication
from .serializers import ProductSerializer, OrderSerializer
#from django.contrib.auth.models import User # Required for User model access
#------------------------------------------------
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password #use for the password encryption

class ProductViewSet(viewsets.ModelViewSet):
    
    queryset = Product.objects.all()
    
    serializer_class = ProductSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated]) # Assumes only logged-in users can create an order
@authentication_classes([SessionAuthentication, JWTAuthentication])
def add_item_to_cart(request):
    user = request.user
    data = request.data # Receives the cart data sent from the frontend

    # 1. Check if the cart contains any items
    order_items_data = data['orderItems'] # Expected data structure sent by frontend
    if order_items_data and len(order_items_data) == 0:
        return Response({'detail': 'No order items.'}, status=status.HTTP_400_BAD_REQUEST)

    # 2. Create a new Order entry
    order = Order.objects.create(
        user=user,
        shipping_price=data.get('shippingPrice',0),
        tax_price=data.get('taxPrice',0),
        total_price=data['totalPrice'],
    )

    # 3. create an ShippingAddress - update 01/09！
    # suppose JSON passed from front end has a "shippingaddress"
    shipping = data['shippingAddress']

    ShippingAddress.objects.create(
        order=order,  #link this address to the newly created order
        address=shipping['address'],
        city=shipping['city'],
        postalCode=shipping['postalCode'],
        country=shipping['country']
    )

    # 4. Iterate over cart items and create OrderItem entries
    for item in order_items_data:
        # Retrieve the Product instance using the ID provided by the frontend
        product = Product.objects.get(id=item['product']) 

        item_model = OrderItem.objects.create(
            product=product,
            order=order,
            name=product.name,
            qty=item['qty'],
            price=item['price'],
            image=product.image.url # Ensures correct image path for the snapshot
        )
        
        #  Update product stock
        product.count_in_stock -= item_model.qty
        # save change back to the database
        product.save()

    serializer = OrderSerializer(order, many=False)
    # Return the created order information
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# create a customized Token Serializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    # rewrite the validate func，add more user info in the token (ex: username)
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        # ... 
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# fetch (Profile)  Serializer 
class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name']
    
    # let name shows the username (can also handle first_name + last_name here)
    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.username
        return name

# retreive detailed user info API (can only visit after log in)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

# register user API
@api_view(['POST'])
def registerUser(request):
    data = request.data
    
    try:
        # check if the username already exist
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'], #  use email as the username
            email=data['email'],
            # use make_password function to encrypt the password
            password=make_password(data['password']) 
        )

        serializer = UserSerializer(user, many=False)
        # upon registration completes, we return the token and let user log in
        token = MyTokenObtainPairSerializer.get_token(user)
        
        return Response({
            'user': serializer.data,
            'access': str(token.access_token),
            'refresh': str(token),
        }, status=status.HTTP_201_CREATED)

    except:
        # if the username already existed
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    try:
        # make sure the user can only see her or his order
        order = Order.objects.get(id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': '無權查看此訂單'}, status=status.HTTP_400_BAD_REQUEST)
    except Order.DoesNotExist:
        return Response({'detail': '訂單不存在'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    # 1. Get the current logged-in user
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)

    return Response(serializer.data)