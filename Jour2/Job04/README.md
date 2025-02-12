# Docker Apache PHP Info

## Description
Ce projet utilise Docker pour créer un serveur Apache/PHP affichant les informations du serveur via phpinfo().

## Instructions
1. Construire l'image :
```bash
docker build -t my-php-apache .
```

2. Lancer le conteneur :
```bash
docker run -d -p 8080:80 --name php-info my-php-apache
```

3. Accéder à l'application : http://localhost:8081

## Captures d'écran
![PHP Info](./images/phpinfo.png)
