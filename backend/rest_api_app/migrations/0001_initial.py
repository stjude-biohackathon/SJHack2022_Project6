# Generated by Django 3.2.12 on 2022-04-10 19:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Schema',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('table_name', models.CharField(max_length=80)),
                ('column', models.CharField(max_length=80)),
                ('type', models.CharField(choices=[('FLOAT', 'Float'), ('STR', 'String')], max_length=10)),
                ('is_primary', models.BooleanField(verbose_name=False)),
                ('is_foreign', models.BooleanField(verbose_name=False)),
                ('foreign_table', models.CharField(max_length=80)),
            ],
        ),
        migrations.CreateModel(
            name='Data',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('table_name', models.CharField(max_length=80)),
                ('value', models.CharField(max_length=100)),
                ('column', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rest_api_app.schema')),
            ],
        ),
    ]
