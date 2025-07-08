-- Script pour insérer des produits reconditionnés de test
-- À exécuter après avoir créé la base de données

-- Insérer des produits reconditionnés de test
INSERT INTO reconditioned_products (
    name, 
    appliance_type_id, 
    brand_id, 
    model, 
    price, 
    original_price, 
    savings_percentage, 
    condition_rating, 
    warranty_months, 
    features, 
    description, 
    image_url, 
    stock_quantity, 
    is_available
) VALUES
-- Lave-linge Samsung
(
    'Lave-linge Samsung WW80T4540TE',
    1, -- Lave-linge
    1, -- Samsung
    'WW80T4540TE',
    299.00,
    599.00,
    50.08,
    'very_good',
    18,
    '["8kg", "1400 tr/min", "A+++", "Écran LED", "15 programmes"]',
    'Lave-linge reconditionné avec garantie étendue. Testé et nettoyé par nos experts.',
    '/photo-machine.webp',
    3,
    true
),

-- Lave-vaisselle Bosch
(
    'Lave-vaisselle Bosch SMS2ITI01E',
    2, -- Lave-vaisselle
    2, -- Bosch
    'SMS2ITI01E',
    249.00,
    449.00,
    44.54,
    'excellent',
    18,
    '["14 couverts", "6 programmes", "A++", "Silence Plus", "EcoSilence Drive"]',
    'Lave-vaisselle reconditionné ultra-silencieux avec technologie EcoSilence Drive.',
    '/placeholder.svg?height=400&width=400&text=Bosch+Lave-vaisselle',
    2,
    true
),

-- Réfrigérateur Whirlpool
(
    'Réfrigérateur Whirlpool WBC35351A+',
    3, -- Réfrigérateur
    3, -- Whirlpool
    'WBC35351A+',
    399.00,
    799.00,
    50.06,
    'good',
    12,
    '["324L", "No Frost", "A++", "Multi Air Flow", "Zone fraîche"]',
    'Réfrigérateur combiné reconditionné avec système No Frost et zone fraîche.',
    '/placeholder.svg?height=400&width=400&text=Whirlpool+Réfrigérateur',
    1,
    true
),

-- Four Electrolux
(
    'Four Electrolux EOB2100AOX',
    4, -- Four
    7, -- Electrolux
    'EOB2100AOX',
    199.00,
    399.00,
    50.13,
    'very_good',
    15,
    '["71L", "Pyrolyse", "A+", "Grill", "Convection"]',
    'Four encastrable reconditionné avec fonction pyrolyse et convection.',
    '/placeholder.svg?height=400&width=400&text=Electrolux+Four',
    2,
    true
),

-- Micro-ondes Panasonic
(
    'Micro-ondes Panasonic NN-DS1100',
    5, -- Micro-ondes
    8, -- Panasonic (à ajouter dans appliance_brands)
    'NN-DS1100',
    89.00,
    149.00,
    40.27,
    'good',
    6,
    '["23L", "800W", "Grill", "Inverter", "Auto Cook"]',
    'Micro-ondes reconditionné avec technologie Inverter pour une cuisson uniforme.',
    '/placeholder.svg?height=400&width=400&text=Panasonic+Micro-ondes',
    5,
    true
),

-- Lave-linge LG
(
    'Lave-linge LG F4WV710P2E',
    1, -- Lave-linge
    4, -- LG
    'F4WV710P2E',
    429.00,
    649.00,
    33.90,
    'excellent',
    18,
    '["10kg", "1400 tr/min", "A+++", "Direct Drive", "Smart Diagnosis"]',
    'Lave-linge grande capacité reconditionné avec technologie Direct Drive.',
    '/placeholder.svg?height=400&width=400&text=LG+Lave-linge',
    2,
    true
),

-- Sèche-linge Bosch
(
    'Sèche-linge Bosch WTG86400FF',
    6, -- Sèche-linge
    2, -- Bosch
    'WTG86400FF',
    349.00,
    599.00,
    41.74,
    'very_good',
    18,
    '["8kg", "A+++", "Heat Pump", "SensDry", "Anti-rides"]',
    'Sèche-linge reconditionné avec technologie Heat Pump pour une efficacité énergétique optimale.',
    '/placeholder.svg?height=400&width=400&text=Bosch+Sèche-linge',
    1,
    true
),

-- Réfrigérateur Samsung
(
    'Réfrigérateur Samsung RB38A7B6SA9',
    3, -- Réfrigérateur
    1, -- Samsung
    'RB38A7B6SA9',
    549.00,
    899.00,
    38.93,
    'excellent',
    24,
    '["380L", "No Frost", "A++", "Twin Cooling Plus", "Digital Inverter"]',
    'Réfrigérateur combiné reconditionné avec technologie Twin Cooling Plus.',
    '/placeholder.svg?height=400&width=400&text=Samsung+Réfrigérateur',
    1,
    true
);

-- Ajouter Panasonic dans les marques si pas déjà présent
INSERT IGNORE INTO appliance_brands (name, is_certified) VALUES ('Panasonic', FALSE);

-- Insérer quelques avis de test
INSERT INTO product_reviews (product_id, user_id, rating, review_text) VALUES
(1, 1, 5, 'Excellent produit, fonctionne parfaitement. Livraison rapide.'),
(1, 2, 4, 'Très satisfait de mon achat, appareil en très bon état.'),
(2, 1, 5, 'Lave-vaisselle ultra-silencieux, très efficace.'),
(3, 3, 4, 'Réfrigérateur en bon état, livraison professionnelle.'),
(4, 2, 5, 'Four parfait, fonction pyrolyse impeccable.'),
(5, 1, 4, 'Micro-ondes pratique et efficace.'),
(6, 3, 5, 'Lave-linge LG de qualité, très satisfait.'),
(7, 2, 4, 'Sèche-linge Bosch performant, économies d\'énergie.'),
(8, 1, 5, 'Réfrigérateur Samsung excellent, grande capacité.');

-- Afficher les produits insérés
SELECT 
    rp.id,
    rp.name,
    rp.price,
    rp.original_price,
    rp.savings_percentage,
    rp.condition_rating,
    rp.warranty_months,
    rp.stock_quantity,
    at.name as appliance_type,
    ab.name as brand
FROM reconditioned_products rp
JOIN appliance_types at ON rp.appliance_type_id = at.id
JOIN appliance_brands ab ON rp.brand_id = ab.id
ORDER BY rp.id; 