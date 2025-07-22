from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from pymongo import MongoClient
import os
import re
import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
admins_collection = db["Admins"]

# Helper function to validate email
def is_valid_email(email):
    regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(regex, email) is not None

# Helper function to validate name (alphabetic only)
def is_valid_name(name):
    return name.isalpha()

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_signup(request):
    """
    Admin registration with name, email, and password.
    Generates JWT token upon success.
    """
    data = request.data
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()

    # Validation
    if not name or not is_valid_name(name):
        return Response({"error": "Name is required and must be alphabetic."}, status=status.HTTP_400_BAD_REQUEST)
    
    if not email or not is_valid_email(email):
        return Response({"error": "A valid email is required."}, status=status.HTTP_400_BAD_REQUEST)
    
    if not password or len(password) < 8:
        return Response({"error": "Password must be at least 8 characters long."}, status=status.HTTP_400_BAD_REQUEST)

    # Check if email already exists
    if admins_collection.find_one({"email": email}):
        return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

    # Save admin in MongoDB
    admins_collection.insert_one({
        "name": name,
        "email": email,
        "password": password  # NOTE: For production, hash this using bcrypt
    })

    # Generate JWT token
    refresh = RefreshToken.for_user(type('User', (object,), {'id': email}))
    token = str(refresh.access_token)

    return Response({"message": "Admin registered successfully.", "token": token}, status=status.HTTP_201_CREATED)
