#!/bin/bash

python manage.py makemigrations authentication game chat friends notification tournament

python manage.py migrate

python manage.py create_bot

python manage.py runserver 0.0.0.0:8000
