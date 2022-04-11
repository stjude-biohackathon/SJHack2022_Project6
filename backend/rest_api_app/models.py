from unittest.mock import DEFAULT
from django.db import models

class Table(models.Model):
	table_name = models.CharField(max_length = 80)

	def __str__(self):
		return self.table_name

class Schema(models.Model):
	DATA_TYPES = (
		('FLOAT','Float'), ('STR','String')
	)
	schema_name = models.CharField(max_length = 80, default='default_schema')
	table_name = models.CharField(max_length = 80)
	column = models.CharField(max_length = 80)
	type = models.CharField(max_length = 10, choices = DATA_TYPES)
	is_primary = models.BooleanField()
	is_foreign = models.BooleanField()
	foreign_table = models.ForeignKey(Table, on_delete = models.CASCADE, null=True)
	
	def __str__(self):
		return self.column

class Data(models.Model):
	table_name = models.CharField(max_length = 80)
	column = models.CharField(max_length = 80)
	value = models.CharField(max_length = 100)