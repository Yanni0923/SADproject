
# Set the base image to node:12-alpine
FROM node:12-alpine as build

# Specify where our app will live in the container
WORKDIR /app

# Copy the React App to the container
COPY . /app/
RUN npm install -g serve
# Prepare the container for building React
RUN npm install
# We want the production version
RUN npm run build

<<<<<<< HEAD
# Prepare nginx
# Pull nginx base image
FROM nginx:1.17.1-alpine
EXPOSE 80
# Build file to nginx
COPY --from=build /app/web-build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d
=======

CMD ["serve", "-s", "web-build"]
# # Prepare nginx
# # Pull nginx base image
# FROM nginx:1.17.1-alpine

# # Build file to nginx
# COPY --from=build /app/web-build /usr/share/nginx/html
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d

>>>>>>> c3f10889cac66449dc66f0dbb171b66a96cbdd03
