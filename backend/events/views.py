from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password , make_password
from pymongo import MongoClient
from dotenv import load_dotenv
import os, jwt, datetime, json , re

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")
JWT_SECRET = os.getenv("JWT_SECRET", "mysecret")  # Add this in .env

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
admins_collection = db["Admins"]
users_collection = db["Users"]

@csrf_exempt
def signin(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method."}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()

        # Validate email
        if not email or "@" not in email:
            return JsonResponse({"error": "Email is not valid."}, status=400)

        # 1. Check in Admin Collection
        admin = admins_collection.find_one({"email": email})
        if admin and check_password(password, admin.get("password", "")):
            payload = {
                "email": admin["email"],
                "role": "Admin",
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2),
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
            return JsonResponse({"token": token, "role": "Admin"})

        # 2. Check in Users Collection
        user = users_collection.find_one({"email": email})
        if user and check_password(password, user.get("password", "")):
            payload = {
                "email": user["email"],
                "name": user.get("name", ""),
                "role": "User",
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2),
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
            return JsonResponse({"token": token, "role": "User"})

        # If no match
        return JsonResponse({"error": "Invalid credentials."}, status=401)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



# Helper: Validate password complexity
def is_valid_password(password):
    return (
        len(password) >= 8
        and re.search(r"[A-Z]", password)
        and re.search(r"[a-z]", password)
        and re.search(r"\d", password)
        and re.search(r"[^A-Za-z0-9]", password)
    )


# Helper: Validate email format
def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)


# ----------------- USER SIGN UP ----------------- #
@csrf_exempt
def user_signup(request):
    try:
        if request.method != "POST":
            return JsonResponse({"error": "Invalid request method"}, status=405)

        data = json.loads(request.body)
        name = data.get("name", "").strip()
        email = data.get("email", "").lower()
        password = data.get("password", "")
        confirm_password = data.get("confirm_password", "")

        # Validations
        if not name.isalpha():
            return JsonResponse({"error": "Name should contain alphabets only"}, status=400)
        if not is_valid_email(email):
            return JsonResponse({"error": "Invalid email format"}, status=400)
        if users_collection.find_one({"email": email}):
            return JsonResponse({"error": "Email already registered"}, status=400)
        if not is_valid_password(password):
            return JsonResponse(
                {"error": "Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special character"},
                status=400
            )
        if password != confirm_password:
            return JsonResponse({"error": "Passwords do not match"}, status=400)

        # Save user with hashed password
        hashed_password = make_password(password)
        user = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": "User",
            "created_at": datetime.datetime.utcnow()
        }
        users_collection.insert_one(user)

        return JsonResponse({"message": "User registered successfully"}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
