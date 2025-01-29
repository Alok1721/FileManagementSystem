FROM python:3.9-slim

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir --no-deps -r requirements.txt

EXPOSE 8089

CMD ["python", "app.py"]
