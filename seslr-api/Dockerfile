FROM tiangolo/uwsgi-nginx-flask:python3.6-alpine3.7

RUN apk add --no-cache py3-psycopg2

ADD ./requirements.txt /

RUN pip3 install -r /requirements.txt

EXPOSE 80