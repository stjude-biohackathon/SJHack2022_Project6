from .models import Schema, Data
from rest_framework import serializers


class SchemaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Schema
        fields = ['table_name', 'column', 'type','is_primary','is_foreign', 'foreign_table']


class DatatSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Data
        fields = ['table_name', 'column', 'value']