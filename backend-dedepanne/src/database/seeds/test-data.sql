-- Données de test pour les tests des formulaires

-- Types d'appareils
INSERT INTO appliance_types (id, name, description) VALUES
(1, 'Lave-linge', 'Machine à laver le linge'),
(2, 'Lave-vaisselle', 'Machine à laver la vaisselle'),
(3, 'Réfrigérateur', 'Appareil de réfrigération'),
(4, 'Four', 'Four de cuisine'),
(5, 'Micro-ondes', 'Four à micro-ondes'),
(6, 'Sèche-linge', 'Machine à sécher le linge')
ON CONFLICT (id) DO NOTHING;

-- Marques
INSERT INTO brands (id, name, description) VALUES
(1, 'Bosch', 'Marque allemande'),
(2, 'Siemens', 'Marque allemande'),
(3, 'Whirlpool', 'Marque américaine'),
(4, 'LG', 'Marque coréenne'),
(5, 'Samsung', 'Marque coréenne'),
(6, 'Electrolux', 'Marque suédoise'),
(7, 'Candy', 'Marque italienne'),
(8, 'Hotpoint', 'Marque britannique'),
(9, 'Indesit', 'Marque italienne'),
(10, 'Zanussi', 'Marque italienne')
ON CONFLICT (id) DO NOTHING;

-- Utilisateurs de test
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, created_at, updated_at) VALUES
(1, 'client@test.com', '$2b$10$test', 'Jean', 'Dupont', '0123456789', 'client', NOW(), NOW()),
(2, 'technician@test.com', '$2b$10$test', 'Pierre', 'Martin', '0987654321', 'technician', NOW(), NOW()),
(3, 'admin@test.com', '$2b$10$test', 'Marie', 'Durand', '0555666777', 'admin', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Produits reconditionnés de test
INSERT INTO reconditioned_products (id, name, appliance_type_id, brand_id, model, price, original_price, savings_percentage, condition_rating, warranty_months, features, description, image_url, stock_quantity, is_available, created_at) VALUES
(1, 'Lave-linge Samsung WW80T4540TE', 1, 5, 'WW80T4540TE', 299.00, 599.00, 50.08, 'very_good', 18, '["8kg", "1400 tr/min", "A+++"]', 'Lave-linge reconditionné avec garantie étendue', '/photo-machine.webp', 3, true, NOW()),
(2, 'Lave-vaisselle Bosch SMS2ITI01E', 2, 1, 'SMS2ITI01E', 249.00, 449.00, 44.54, 'excellent', 18, '["14 couverts", "6 programmes", "A++"]', 'Lave-vaisselle reconditionné ultra-silencieux', '/placeholder.svg', 2, true, NOW()),
(3, 'Réfrigérateur Whirlpool WBC35351A+', 3, 3, 'WBC35351A+', 399.00, 799.00, 50.06, 'good', 12, '["324L", "No Frost", "A++"]', 'Réfrigérateur combiné reconditionné', '/placeholder.svg', 1, true, NOW())
ON CONFLICT (id) DO NOTHING; 