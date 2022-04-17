from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'schema', views.SchemaViewSet)
# router.register(r'data', views.DataViewSet)

urlpatterns = [
    path('', views.home, name='home'),
    path('update_db/', views.repopulate_database, name='update_db'),
    path('api/data/', views.DataViewSet.as_view(), name='api/data'),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]