from django.db import models

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
	foreign_table = models.CharField(max_length = 80, blank = True, null = True)
	
	def __str__(self):
		return self.column

class Data(models.Model):
	table_name = models.CharField(max_length = 80)
	column = models.ForeignKey('Schema', on_delete = models.CASCADE)
	value = models.CharField(max_length = 100)