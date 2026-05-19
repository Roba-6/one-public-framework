FROM python:3.11.15-slim-bookworm

LABEL authors="Roba"

# 環境変数
ENV PYTHONUNBUFFERED=1
ENV POETRY_VIRTUALENVS_IN_PROJECT=true

EXPOSE 8000

WORKDIR /code

COPY backend ./backend
COPY scripts ./scripts

COPY .env .
COPY manage.sh .

RUN pip install --upgrade pip && pip install poetry
RUN chmod +x manage.sh && bash manage.sh init --back
