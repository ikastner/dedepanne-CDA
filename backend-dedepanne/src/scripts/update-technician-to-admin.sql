-- Script pour mettre à jour le compte technicien en admin
-- À exécuter manuellement dans l'espace Swagger ou via psql

-- Vérifier les utilisateurs existants
SELECT id, email, first_name, last_name, role, is_active, created_at 
FROM users 
ORDER BY created_at DESC;

-- Mettre à jour le compte technicien en admin
-- Remplacez l'email par celui du compte technicien que vous voulez promouvoir
UPDATE users 
SET role = 'admin', 
    updated_at = NOW()
WHERE email = 'didier.kastner@dedepanne.fr' 
  AND role = 'technician';

-- Vérifier la mise à jour
SELECT id, email, first_name, last_name, role, is_active, updated_at 
FROM users 
WHERE email = 'didier.kastner@dedepanne.fr';

-- Afficher tous les admins
SELECT id, email, first_name, last_name, role, is_active, created_at 
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC; 