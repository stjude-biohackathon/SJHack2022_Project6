from .models import Schema, Data
from rest_framework import serializers

class SchemaSerializer(serializers.HyperlinkedModelSerializer):
    foreign_table = serializers.StringRelatedField(
        many = False,
        read_only = True
    )

    class Meta:
        model = Schema
        fields = ['table_name', 'column', 'type','is_primary','is_foreign', 'foreign_table']


class DatatSerializer(serializers.ModelSerializer):
    column = serializers.StringRelatedField(
        many = False,
        read_only = True
    )
    class Meta:
        model = Data
        fields = ['table_name', 'column', 'value']