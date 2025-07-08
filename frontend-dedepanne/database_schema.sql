-- =====================================================
-- BASE DE DONNÉES DÉDÉPANNE - SCHÉMA COMPLET
-- =====================================================

CREATE DATABASE IF NOT EXISTS dedepanne_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dedepanne_db;

-- =====================================================
-- TABLES PRINCIPALES
-- =====================================================

-- Utilisateurs (clients, admins, techniciens)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin', 'technician') DEFAULT 'client',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Adresses des clients
CREATE TABLE addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    department VARCHAR(3) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_postal_code (postal_code)
);

-- Types d'appareils
CREATE TABLE appliance_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10),
    base_price DECIMAL(8,2) NOT NULL,
    average_repair_time VARCHAR(10) NOT NULL,
    success_rate DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_name (name)
);

-- Marques d'appareils
CREATE TABLE appliance_brands (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    is_certified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_name (name)
);

-- Zones de service
CREATE TABLE service_zones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    postal_codes JSON NOT NULL,
    department_code VARCHAR(3) NOT NULL,
    average_response_time VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- RÉPARATIONS
-- =====================================================

-- Demandes de réparation
CREATE TABLE repair_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reference_code VARCHAR(20) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    appliance_type_id INT NOT NULL,
    brand_id INT,
    model VARCHAR(100),
    issue_description TEXT NOT NULL,
    urgency ENUM('low', 'normal', 'high', 'emergency') DEFAULT 'normal',
    status ENUM('pending', 'confirmed', 'scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    base_price DECIMAL(8,2) NOT NULL,
    additional_cost DECIMAL(8,2) DEFAULT 0,
    total_cost DECIMAL(8,2) NOT NULL,
    scheduled_date DATE,
    scheduled_time_slot VARCHAR(20),
    technician_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (appliance_type_id) REFERENCES appliance_types(id),
    FOREIGN KEY (brand_id) REFERENCES appliance_brands(id),
    INDEX idx_reference_code (reference_code),
    INDEX idx_status (status)
);

-- Interventions techniques
CREATE TABLE repair_interventions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    repair_request_id INT NOT NULL,
    technician_id INT,
    intervention_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    diagnosis TEXT,
    work_performed TEXT,
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    FOREIGN KEY (repair_request_id) REFERENCES repair_requests(id),
    FOREIGN KEY (technician_id) REFERENCES users(id)
);

-- Pièces utilisées
CREATE TABLE repair_parts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    repair_request_id INT NOT NULL,
    part_name VARCHAR(255) NOT NULL,
    part_number VARCHAR(100),
    quantity INT DEFAULT 1,
    unit_price DECIMAL(8,2) NOT NULL,
    total_price DECIMAL(8,2) NOT NULL,
    warranty_months INT DEFAULT 12,
    FOREIGN KEY (repair_request_id) REFERENCES repair_requests(id)
);

-- =====================================================
-- PRODUITS RECONDITIONNÉS
-- =====================================================

-- Produits reconditionnés
CREATE TABLE reconditioned_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    appliance_type_id INT NOT NULL,
    brand_id INT NOT NULL,
    model VARCHAR(100),
    price DECIMAL(8,2) NOT NULL,
    original_price DECIMAL(8,2) NOT NULL,
    savings_percentage DECIMAL(5,2) NOT NULL,
    condition_rating ENUM('excellent', 'very_good', 'good', 'fair') NOT NULL,
    warranty_months INT NOT NULL,
    features JSON,
    description TEXT,
    image_url VARCHAR(500),
    stock_quantity INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appliance_type_id) REFERENCES appliance_types(id),
    FOREIGN KEY (brand_id) REFERENCES appliance_brands(id),
    INDEX idx_price (price),
    INDEX idx_is_available (is_available)
);

-- Avis sur les produits
CREATE TABLE product_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES reconditioned_products(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- =====================================================
-- COMMANDES ET LIVRAISONS
-- =====================================================

-- Commandes
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reference_code VARCHAR(20) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(8,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_address_id INT NOT NULL,
    delivery_date DATE,
    delivery_time_slot VARCHAR(20),
    installation_required BOOLEAN DEFAULT FALSE,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (delivery_address_id) REFERENCES addresses(id),
    INDEX idx_reference_code (reference_code),
    INDEX idx_status (status)
);

-- Lignes de commande
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT,
    repair_request_id INT,
    item_type ENUM('product', 'repair') NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(8,2) NOT NULL,
    total_price DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES reconditioned_products(id),
    FOREIGN KEY (repair_request_id) REFERENCES repair_requests(id)
);

-- =====================================================
-- DONS D'APPAREILS
-- =====================================================

-- Dons d'appareils
CREATE TABLE appliance_donations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reference_code VARCHAR(20) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    appliance_type_id INT NOT NULL,
    brand_id INT,
    model VARCHAR(100),
    age_years INT,
    condition_description TEXT,
    reason_for_donation TEXT,
    has_accessories BOOLEAN DEFAULT FALSE,
    has_manual BOOLEAN DEFAULT FALSE,
    pickup_required BOOLEAN DEFAULT TRUE,
    status ENUM('pending', 'evaluated', 'accepted', 'pickup_scheduled', 'picked_up', 'reconditioned', 'completed', 'rejected') DEFAULT 'pending',
    pickup_date DATE,
    pickup_time_slot VARCHAR(20),
    voucher_amount DECIMAL(8,2) DEFAULT 50.00,
    voucher_code VARCHAR(20),
    voucher_expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (appliance_type_id) REFERENCES appliance_types(id),
    FOREIGN KEY (brand_id) REFERENCES appliance_brands(id),
    INDEX idx_reference_code (reference_code),
    INDEX idx_status (status)
);

-- =====================================================
-- SUIVI ET NOTIFICATIONS
-- =====================================================

-- Événements de suivi
CREATE TABLE tracking_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    entity_type ENUM('repair', 'donation', 'order') NOT NULL,
    entity_id INT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_description TEXT,
    event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    INDEX idx_entity (entity_type, entity_id)
);

-- Notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('email', 'sms', 'push') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
);

-- =====================================================
-- CONFIGURATION
-- =====================================================

-- Paramètres de l'application
CREATE TABLE app_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT
);

-- Codes postaux éligibles
CREATE TABLE eligible_postal_codes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    postal_code VARCHAR(10) NOT NULL,
    department VARCHAR(3) NOT NULL,
    city VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_postal_code (postal_code)
);

-- =====================================================
-- DONNÉES INITIALES
-- =====================================================

-- Types d'appareils
INSERT INTO appliance_types (name, icon, base_price, average_repair_time, success_rate) VALUES
('Lave-linge', '🧺', 95.00, '2h', 92.00),
('Lave-vaisselle', '🍽️', 95.00, '1h30', 89.00),
('Réfrigérateur', '❄️', 120.00, '2h30', 85.00),
('Four', '🔥', 110.00, '1h45', 91.00),
('Micro-ondes', '📟', 85.00, '1h', 94.00),
('Sèche-linge', '🌪️', 95.00, '2h', 88.00);

-- Marques
INSERT INTO appliance_brands (name, is_certified) VALUES
('Samsung', FALSE),
('Bosch', TRUE),
('Whirlpool', TRUE),
('LG', FALSE),
('Siemens', FALSE),
('Rosieres', TRUE),
('Electrolux', FALSE),
('Beko', FALSE);

-- Zones de service
INSERT INTO service_zones (name, postal_codes, department_code, average_response_time) VALUES
('Paris (75001-75020)', '["75001","75002","75003","75004","75005","75006","75007","75008","75009","75010","75011","75012","75013","75014","75015","75016","75017","75018","75019","75020"]', '75', '2h'),
('Hauts-de-Seine (92)', '["92100","92200","92300","92400","92500","92600","92700","92800","92900"]', '92', '3h'),
('Seine-Saint-Denis (93)', '["93100","93200","93300","93400","93500","93600","93700","93800","93900"]', '93', '4h'),
('Val-de-Marne (94)', '["94100","94200","94300","94400","94500","94600","94700","94800","94900"]', '94', '4h');

-- Codes postaux éligibles (exemples)
INSERT INTO eligible_postal_codes (postal_code, department, city) VALUES
('75001', '75', 'Paris 1er'),
('75002', '75', 'Paris 2e'),
('75003', '75', 'Paris 3e'),
('75004', '75', 'Paris 4e'),
('75005', '75', 'Paris 5e'),
('75006', '75', 'Paris 6e'),
('75007', '75', 'Paris 7e'),
('75008', '75', 'Paris 8e'),
('75009', '75', 'Paris 9e'),
('75010', '75', 'Paris 10e'),
('75011', '75', 'Paris 11e'),
('75012', '75', 'Paris 12e'),
('75013', '75', 'Paris 13e'),
('75014', '75', 'Paris 14e'),
('75015', '75', 'Paris 15e'),
('75016', '75', 'Paris 16e'),
('75017', '75', 'Paris 17e'),
('75018', '75', 'Paris 18e'),
('75019', '75', 'Paris 19e'),
('75020', '75', 'Paris 20e'),
('92100', '92', 'Boulogne-Billancourt'),
('92200', '92', 'Neuilly-sur-Seine'),
('92300', '92', 'Levallois-Perret'),
('92400', '92', 'Courbevoie'),
('92500', '92', 'Rueil-Malmaison'),
('92600', '92', 'Asnières-sur-Seine'),
('92700', '92', 'Colombes'),
('92800', '92', 'Puteaux'),
('92900', '92', 'La Garenne-Colombes'),
('93100', '93', 'Montreuil'),
('93200', '93', 'Saint-Denis'),
('93300', '93', 'Aubervilliers'),
('93400', '93', 'Saint-Ouen'),
('93500', '93', 'Pantin'),
('93600', '93', 'Aulnay-sous-Bois'),
('93700', '93', 'Drancy'),
('93800', '93', 'Épinay-sur-Seine'),
('93900', '93', 'Noisy-le-Grand'),
('94100', '94', 'Saint-Maur-des-Fossés'),
('94200', '94', 'Ivry-sur-Seine'),
('94300', '94', 'Vincennes'),
('94400', '94', 'Vitry-sur-Seine'),
('94500', '94', 'Champigny-sur-Marne'),
('94600', '94', 'Choisy-le-Roi'),
('94700', '94', 'Maisons-Alfort'),
('94800', '94', 'Villejuif'),
('94900', '94', 'Créteil');

-- Paramètres de l'application
INSERT INTO app_settings (setting_key, setting_value, setting_type, description) VALUES
('company_name', 'dédépanne', 'string', 'Nom de l''entreprise'),
('company_phone', '01 23 45 67 89', 'string', 'Numéro de téléphone principal'),
('company_email', 'contact@dedepanne.fr', 'string', 'Email de contact'),
('base_repair_price', '95.00', 'number', 'Prix de base pour une intervention'),
('emergency_phone', '01 23 45 67 89', 'string', 'Numéro d''urgence'),
('donation_voucher_amount', '50.00', 'number', 'Montant du bon d''achat pour un don'),
('voucher_validity_months', '12', 'number', 'Durée de validité des bons d''achat en mois'),
('delivery_fee', '0.00', 'number', 'Frais de livraison'),
('installation_fee', '0.00', 'number', 'Frais d''installation'),
('max_repair_age_years', '10', 'number', 'Âge maximum des appareils pour réparation');

-- =====================================================
-- VUES UTILES
-- =====================================================

-- Vue des demandes de réparation avec détails
CREATE VIEW repair_requests_details AS
SELECT 
    rr.id,
    rr.reference_code,
    rr.status,
    rr.urgency,
    rr.total_cost,
    rr.scheduled_date,
    rr.scheduled_time_slot,
    rr.created_at,
    u.first_name,
    u.last_name,
    u.phone,
    u.email,
    at.name as appliance_type,
    at.icon as appliance_icon,
    ab.name as brand,
    rr.model,
    rr.issue_description
FROM repair_requests rr
JOIN users u ON rr.user_id = u.id
JOIN appliance_types at ON rr.appliance_type_id = at.id
LEFT JOIN appliance_brands ab ON rr.brand_id = ab.id;

-- Vue des produits reconditionnés avec détails
CREATE VIEW reconditioned_products_details AS
SELECT 
    rp.id,
    rp.name,
    rp.price,
    rp.original_price,
    rp.savings_percentage,
    rp.condition_rating,
    rp.warranty_months,
    rp.stock_quantity,
    rp.is_available,
    at.name as appliance_type,
    at.icon as appliance_icon,
    ab.name as brand,
    ab.is_certified,
    AVG(pr.rating) as average_rating,
    COUNT(pr.id) as review_count
FROM reconditioned_products rp
JOIN appliance_types at ON rp.appliance_type_id = at.id
JOIN appliance_brands ab ON rp.brand_id = ab.id
LEFT JOIN product_reviews pr ON rp.id = pr.product_id
GROUP BY rp.id;

-- Vue des dons avec détails
CREATE VIEW donation_details AS
SELECT 
    ad.id,
    ad.reference_code,
    ad.status,
    ad.voucher_amount,
    ad.voucher_code,
    ad.pickup_date,
    ad.created_at,
    u.first_name,
    u.last_name,
    u.phone,
    u.email,
    at.name as appliance_type,
    at.icon as appliance_icon,
    ab.name as brand,
    ad.model,
    ad.age_years,
    ad.condition_description
FROM appliance_donations ad
JOIN users u ON ad.user_id = u.id
JOIN appliance_types at ON ad.appliance_type_id = at.id
LEFT JOIN appliance_brands ab ON ad.brand_id = ab.id;

-- =====================================================
-- INDEX OPTIMISATION
-- =====================================================

CREATE INDEX idx_repair_requests_status_date ON repair_requests(status, scheduled_date);
CREATE INDEX idx_repair_requests_user_status ON repair_requests(user_id, status);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_donations_user_status ON appliance_donations(user_id, status);
CREATE INDEX idx_products_available_price ON reconditioned_products(is_available, price);
CREATE INDEX idx_tracking_entity_date ON tracking_events(entity_type, entity_id, event_date);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger pour mettre à jour le total_cost des demandes de réparation
DELIMITER //
CREATE TRIGGER update_repair_total_cost
BEFORE UPDATE ON repair_requests
FOR EACH ROW
BEGIN
    SET NEW.total_cost = NEW.base_price + NEW.additional_cost;
END//
DELIMITER ;

-- Trigger pour mettre à jour le total_amount des commandes
DELIMITER //
CREATE TRIGGER update_order_total_amount
BEFORE UPDATE ON orders
FOR EACH ROW
BEGIN
    SET NEW.total_amount = NEW.subtotal + NEW.delivery_fee;
END//
DELIMITER ; 