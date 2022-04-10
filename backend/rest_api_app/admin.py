from django.contrib import admin
from .models import Schema, Data

class SchemaAdmin(admin.ModelAdmin):
    list_display = ['table_name', 'column', 'type','is_primary','is_foreign', 'foreign_table']

class DataAdmin(admin.ModelAdmin):
    list_display = ['table_name', 'column', 'value']

admin.site.register(Schema, SchemaAdmin)
admin.site.register(Data, DataAdmin)
