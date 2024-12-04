from rest_framework import serializers
from .models import UserInfo

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        fields = ['UserID', 'FirstName', 'LastName', 'Business', 'Address', 'PhoneNumber']