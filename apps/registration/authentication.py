from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    SessionAuthentication that doesn't enforce CSRF for API views
    """
    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening
