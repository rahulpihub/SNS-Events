from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password , make_password
from pymongo import MongoClient
from dotenv import load_dotenv
import os, jwt, datetime, json , re , base64

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")
JWT_SECRET = os.getenv("JWT_SECRET", "mysecret")  # Add this in .env

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
admins_collection = db["Admins"]
users_collection = db["Users"]
events_collection = db["Events"]

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


@csrf_exempt
def ai_description(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method."}, status=405)

    try:
        data = json.loads(request.body)
        title = data.get("title")
        venue = data.get("venue")
        start_time = data.get("start_time")
        end_time = data.get("end_time")
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        cost = data.get("cost")

        if not all([title, venue, start_time, end_time, start_date, end_date, cost]):
            return JsonResponse({"error": "All event details are required."}, status=400)

        # Setup Gemini API
        import google.generativeai as genai
        genai.configure(api_key="AIzaSyCESDpD47v4rUfcfddhceqAna52vTCnDGg")
        model = genai.GenerativeModel("gemini-2.0-flash")

        prompt = f"""
        Create a professional and engaging event description using the following details:
        - Title: {title}
        - Venue: {venue}
        - Start: {start_date} at {start_time}
        - End: {end_date} at {end_time}
        - Cost: INR {cost}
        """

        result = model.generate_content(prompt)
        description = result.text.strip()

        # Remove markdown formatting (##, **)
        description = re.sub(r"\*\*(.*?)\*\*", r"\1", description)  # Remove bold (**text**)
        description = re.sub(r"##\s*", "", description)             # Remove headings starting with ##
        description = re.sub(r"#\s*", "", description)              # Remove any single # if present

        return JsonResponse({"description": description})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt
def create_event(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method."}, status=405)

    try:
        # Extract JWT token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JsonResponse({"error": "Authorization token is missing."}, status=401)

        token = auth_header.split(" ")[1]
        try:
            decoded_token = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            admin_email = decoded_token.get("email")
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token expired."}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token."}, status=401)

        data = json.loads(request.body)

        title = data.get("title", "").strip()
        venue = data.get("venue", "").strip()
        start_date = data.get("startDate")
        end_date = data.get("endDate")
        start_time = data.get("startTime")
        end_time = data.get("endTime")
        cost = data.get("cost")
        description = data.get("description", "").strip()
        image_base64 = data.get("image_base64", "")

        # Validation: Required fields
        if not title or len(title) > 50:
            return JsonResponse({"error": "Title is required and max 50 chars."}, status=400)
        if not venue or len(venue) > 150:
            return JsonResponse({"error": "Venue is required and max 150 chars."}, status=400)
        if not start_date or not end_date or not start_time or not end_time:
            return JsonResponse({"error": "Start and end date/time are required."}, status=400)
        if not image_base64:
            return JsonResponse({"error": "Event image is required."}, status=400)

        # Convert strings to date/time objects
        try:
            start_date_obj = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date_obj = datetime.datetime.strptime(end_date, "%Y-%m-%d").date()
            start_time_obj = datetime.datetime.strptime(start_time, "%H:%M").time()
            end_time_obj = datetime.datetime.strptime(end_time, "%H:%M").time()
        except ValueError:
            return JsonResponse({"error": "Invalid date or time format."}, status=400)

        # Logical date/time validation
        if start_date_obj > end_date_obj or (start_date_obj == end_date_obj and start_time_obj >= end_time_obj):
            return JsonResponse({"error": "Start date/time must be before end date/time."}, status=400)

        # Validate base64 image
        try:
            base64.b64decode(image_base64)
        except Exception:
            return JsonResponse({"error": "Invalid image format."}, status=400)

        # Save to Events collection
        event_data = {
            "title": title,
            "venue": venue,
            "start_date": start_date,
            "end_date": end_date,
            "start_time": start_time,
            "end_time": end_time,
            "cost": cost,
            "description": description,
            "image_base64": image_base64,
            "admin_email": admin_email,
            "created_at": datetime.datetime.utcnow()
        }

        events_collection.insert_one(event_data)
        return JsonResponse({"message": "Event created successfully."})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
