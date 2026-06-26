FROM node:lts-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

FROM nginx:alpine

COPY --from=build /app/dist/bodega-peirano-ui/browser /usr/share/nginx/html

# 1. Usamos tu excelente idea para el template de Nginx
# Lo renombramos a default.conf.template para que Nginx sepa que es el principal
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# 2. Inyectamos la variable en Angular usando el sistema nativo de Nginx
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-replace-angular-env.sh && \
    echo 'echo "🔧 Reemplazando variables en Angular..."' >> /docker-entrypoint.d/40-replace-angular-env.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|PLACEHOLDER_BACKEND_URL|${ANGULAR_API_URL}|g" {} \;' >> /docker-entrypoint.d/40-replace-angular-env.sh && \
    chmod +x /docker-entrypoint.d/40-replace-angular-env.sh

EXPOSE 80
# No ponemos ENTRYPOINT. Dejamos que Nginx haga lo suyo.
