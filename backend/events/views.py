from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import check_password
from pymongo import MongoClient
from dotenv import load_dotenv
import os, jwt, datetime, json

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")
JWT_SECRET = os.getenv("JWT_SECRET", "mysecret")  # Add this in .env

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
admins_collection = db["Admins"]

@csrf_exempt
def admin_signin(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method."}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()

        # Validate email
        if not email or "@" not in email:
            return JsonResponse({"error": "Email is not valid."}, status=400)

        # Find admin by email
        admin = admins_collection.find_one({"email": email})
        if not admin:
            return JsonResponse({"error": "Admin not found."}, status=404)

        # Check password
        if not check_password(password, admin.get("password", "")):
            return JsonResponse({"error": "Invalid credentials."}, status=401)

        # Generate JWT token
        payload = {
            "email": admin["email"],
            "role": admin.get("role", "Admin"),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2),
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

        return JsonResponse({"token": token})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
