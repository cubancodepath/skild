CREATE USER keycloak WITH PASSWORD 'keycloak_password';
CREATE DATABASE keycloak OWNER keycloak;
GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;
