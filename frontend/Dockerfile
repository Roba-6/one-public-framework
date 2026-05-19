FROM node:22.22.3-bookworm-slim AS build

LABEL authors="Roba"

WORKDIR /code

COPY frontend ./frontend
COPY resources ./resources
COPY scripts ./scripts

COPY .env .
COPY manage.sh .

RUN corepack enable && \
    corepack prepare yarn@4.3.1 --activate
RUN chmod +x manage.sh && \
    bash manage.sh init --prod --front && \
    bash manage.sh build --prod --front

FROM nginx:alpine

LABEL authors="Roba"

EXPOSE 80

COPY --from=build /code/frontend/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
