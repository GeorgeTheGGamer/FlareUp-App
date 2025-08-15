import requests 
from django.conf import settings
import logging
from django.core.cache import cache
import time

# Isolate API call to service layer
# Makes Views Cleaner and project Well Structured

logger = logging.getLogger(__name__)

# Using Sandbox which is public. Can use a .env to hold the new base URL and API Key
EXPO_PUBLIC_SKINCONDITION_API_KEY = 'https://sandbox.api.service.nhs.uk/nhs-website-content'


# Speed Up App by Caching the API Data and Reduce the number of API Calls
def get_cached_nhs_data(condition):
    cache_key = f"nhs_data_{condition}"
    nhs_data = cache.get(cache_key)


    if not nhs_data:
        nhs_data = get_nhs_data(condition=condition)
        cache.set(cache_key, nhs_data, timeout=300)

    return nhs_data

# Can Easily Upgrade to higher tier but using the Sandbox
def get_nhs_data(condition):
    try:
        url= f"{EXPO_PUBLIC_SKINCONDITION_API_KEY}/conditions/{condition}"
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to retrieve NHS Data: {e}")



# Fetch Data which respects the API Call limit by waiting till free again and by caching
# All of these ways and Security is Why it is best to Handle API Calls in the Django Backend 

'''def fetch_data():
    headers = {
        "Authorization": f"Bearer {settings.API_KEY}"
    }
    response = requests.get("https://api.twitter.com/2/tweets", headers=headers)
    if response.status_code == 429:  # Too Many Requests
        wait_time = int(response.headers.get("Retry-After", 60))
        time.sleep(wait_time)
        return fetch_data()  # Retry after wait time
    return response.json()'''

