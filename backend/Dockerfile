FROM python:3.11-slim-bullseye

RUN apt-get update && apt-get install -y curl && apt-get install -y netcat

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade -r requirements.txt

COPY . .

RUN chmod +x ./init.sh

CMD ["bash", "./init.sh"]