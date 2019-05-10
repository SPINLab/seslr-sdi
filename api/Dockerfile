FROM tiangolo/uwsgi-nginx-flask:python3.6-alpine3.7

RUN apk add --no-cache libpq

RUN apk update && \
    apk add --virtual .build-deps gcc python-dev musl-dev postgresql-dev

ADD ./requirements.txt /

RUN pip3 install -r /requirements.txt

RUN apk del .build-deps

ADD ./api /app

ARG SESLR_APP_MODE
ENV SESLR_APP_MODE $SESLR_APP_MODE

RUN python3 /app/swagger.py

EXPOSE 80