# Utiliser une image de base Nginx avec PHP
FROM php:7.4-fpm

# Installer Nginx
RUN apt-get update && apt-get install -y nginx

# Créer le répertoire de travail
WORKDIR /var/www/html

# Copier les fichiers du projet dans le container
COPY index.html .
COPY save.php .
COPY results.json .

# Configurer Nginx
COPY nginx.conf /etc/nginx/sites-available/default

# Définir les droits pour Nginx et PHP
RUN chown -R www-data:www-data /var/www/html && \
    chmod 755 /var/www/html/save.php && \
    chmod 666 /var/www/html/results.json

# Exposer les ports nécessaires
EXPOSE 80

# Lancer PHP et Nginx
CMD ["sh", "-c", "php-fpm & nginx -g 'daemon off;'"] 