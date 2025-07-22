from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def test(request):
    return JsonResponse({"message": "Django backend is connected to React frontend!"})
