-- Script pour vérifier l'utilisateur admin
-- À exécuter dans l'espace Swagger ou via psql

-- Vérifier tous les utilisateurs
SELECT id, email, first_name, last_name, role, is_active, created_at 
FROM users 
ORDER BY created_at DESC;

-- Vérifier spécifiquement l'utilisateur dedepanne@test.fr
SELECT id, email, first_name, last_name, role, is_active, created_at, updated_at
FROM users 
WHERE email = 'dedepanne@test.fr';

-- Vérifier tous les admins
SELECT id, email, first_name, last_name, role, is_active, created_at 
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- Vérifier tous les techniciens
SELECT id, email, first_name, last_name, role, is_active, created_at 
FROM users 
WHERE role = 'technician'
ORDER BY created_at DESC; 