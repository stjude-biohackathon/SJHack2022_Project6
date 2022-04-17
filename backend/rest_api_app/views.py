from asyncio import constants
from django.shortcuts import render
import requests
import csv
from rest_framework import viewsets, generics
from os import listdir
from os.path import isfile, join, splitext
from .models import Table, Schema, Data
from .serializers import SchemaSerializer, DatatSerializer

def home(request):
	# load Schema from the csv files
	schema = Schema.objects.all()
	tables = Schema.objects.values('table_name').distinct()
	data = Data.objects.all()

	if (schema.count() == 0):
		load_csv_data()

	return render(request, 'home.html', {'tables': tables, 'data': data})

def load_csv_data():
	csv_files_path = './backend/raw_data/'
	schema_name_temp = 'schema_1'
	csv_files = [f for f in listdir(csv_files_path) if isfile(join(csv_files_path, f))]
	for csv_file in csv_files:
		csv_path = csv_files_path + csv_file
		line_count = 0
		with open(csv_path, mode='r') as file:
			spamreader = csv.reader(file, delimiter=',')
			table_name_temp = splitext(csv_file)[0]
			Table.objects.create(
				table_name = table_name_temp
			)
			columns = []
			for row in spamreader:
				if line_count == 0:
					line_count += 1
					columns = row
					for idx, column_temp in enumerate(columns):
						Schema.objects.create(
							schema_name = schema_name_temp,
							table_name = table_name_temp,
							column = column_temp,
							type = 'STR',
							is_primary = True if idx==0 else False,
							is_foreign = False
						)
				else:
					for idx, value_temp in enumerate(row):
						Data.objects.create(
							table_name = table_name_temp,
							column = columns[idx],
							value = value_temp
						)


class SchemaViewSet(viewsets.ModelViewSet):
	"""
    API endpoint that shows schema.
    """
	queryset = Schema.objects.all().order_by('table_name')
	serializer_class = SchemaSerializer

class DataViewSet(generics.ListAPIView):
	"""
    API endpoint that shows data.
    """
	queryset = Data.objects.all()
	serializer_class = DatatSerializer

	filter_fields = {
		'table_name': ['in','exact'],
		'column': ['in','exact']
	}