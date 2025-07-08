# Diagramme de Classes - Application DeDePanne

## Vue d'ensemble du système

Ce diagramme représente l'architecture complète de l'application DeDePanne, incluant les entités backend, les composants frontend, et les services.

```mermaid
classDiagram
    %% ===== ENTITÉS BACKEND (Base de données) =====
    
    class User {
        +id: number
        +email: string
        +password_hash: string
        +role: UserRole
        +first_name: string
        +last_name: string
        +phone: string
        +is_active: boolean
        +created_at: Date
        +updated_at: Date
        +getAddresses()
        +getRepairRequests()
        +getDonations()
        +getOrders()
    }
    
    class Address {
        +id: number
        +user_id: number
        +address_line1: string
        +city: string
        +postal_code: string
        +department: string
        +is_primary: boolean
    }
    
    class RepairRequest {
        +id: number
        +reference_code: string
        +user_id: number
        +appliance_type_id: number
        +brand_id: number
        +model: string
        +issue_description: string
        +status: RepairStatus
        +base_price: number
        +additional_cost: number
        +total_cost: number
        +scheduled_date: Date
        +scheduled_time_slot: string
        +technician_notes: string
        +created_at: Date
        +updated_at: Date
        +getInterventions()
        +getHistory()
    }
    
    class Intervention {
        +id: number
        +repair_request_id: number
        +date: Date
        +start_time: string
        +end_time: string
        +status: InterventionStatus
        +commentaire: string
        +next_action: string
        +created_at: Date
        +updated_at: Date
        +getHistory()
    }
    
    class ReconditionedProduct {
        +id: number
        +name: string
        +appliance_type_id: number
        +brand_id: number
        +model: string
        +price: number
        +original_price: number
        +savings_percentage: number
        +condition_rating: ConditionRating
        +warranty_months: number
        +features: JSON
        +description: string
        +image_url: string
        +stock_quantity: number
        +is_available: boolean
        +created_at: Date
        +updated_at: Date
    }
    
    class Order {
        +id: number
        +user_id: number
        +reference_code: string
        +status: OrderStatus
        +total_amount: number
        +delivery_date: Date
        +created_at: Date
        +updated_at: Date
        +getItems()
        +getHistory()
    }
    
    class OrderItem {
        +id: number
        +order_id: number
        +product_id: number
        +name: string
        +price: number
        +created_at: Date
    }
    
    class Donation {
        +id: number
        +user_id: number
        +reference_code: string
        +appliance_type_id: number
        +brand_id: number
        +status: DonationStatus
        +pickup_date: Date
        +address: string
        +created_at: Date
        +updated_at: Date
        +getHistory()
    }
    
    %% ===== ENUMS =====
    
    class UserRole {
        <<enumeration>>
        ADMIN
        PRO
        CLIENT
    }
    
    class RepairStatus {
        <<enumeration>>
        PENDING
        CONFIRMED
        SCHEDULED
        IN_PROGRESS
        COMPLETED
        CANCELLED
    }
    
    class InterventionStatus {
        <<enumeration>>
        SCHEDULED
        IN_PROGRESS
        COMPLETED
        CANCELLED
    }
    
    class OrderStatus {
        <<enumeration>>
        PENDING
        CONFIRMED
        SHIPPED
        DELIVERED
        CANCELLED
    }
    
    class DonationStatus {
        <<enumeration>>
        PENDING
        CONFIRMED
        PICKED_UP
        PROCESSED
        COMPLETED
        CANCELLED
    }
    
    class ConditionRating {
        <<enumeration>>
        EXCELLENT
        VERY_GOOD
        GOOD
        FAIR
    }
    
    %% ===== COMPOSANTS FRONTEND =====
    
    class AuthContext {
        +user: User
        +isAuthenticated: boolean
        +login(email, password)
        +logout()
        +register(userData)
        +getProfile()
    }
    
    class RepairForm {
        +applianceType: string
        +brand: string
        +model: string
        +issueDescription: string
        +address: string
        +submitForm()
        +validateForm()
        +resetForm()
    }
    
    class DonationForm {
        +applianceType: string
        +brand: string
        +condition: string
        +address: string
        +pickupDate: Date
        +submitForm()
        +validateForm()
        +resetForm()
    }
    
    class ProductCard {
        +product: ReconditionedProduct
        +addToCart()
        +viewDetails()
        +checkAvailability()
    }
    
    class OrderTracking {
        +order: Order
        +trackOrder()
        +getOrderStatus()
        +getDeliveryInfo()
    }
    
    class Dashboard {
        +userRepairs: RepairRequest[]
        +userDonations: Donation[]
        +userOrders: Order[]
        +loadUserData()
        +refreshData()
    }
    
    %% ===== SERVICES BACKEND =====
    
    class AuthService {
        +register(createUserDto)
        +login(loginDto)
        +getProfile(userId)
        +validateToken(token)
        +generateToken(user)
    }
    
    class RepairsService {
        +createRepairRequest(dto, userId)
        +findAllRepairRequests(userId, role)
        +findRepairRequestById(id, userId, role)
        +updateRepairRequest(id, dto, userId, role)
        +createIntervention(repairRequestId, dto, userId)
        +updateIntervention(id, dto, userId)
        +finalizeIntervention(id, userId)
    }
    
    class DonationsService {
        +createDonation(userId, donationData)
        +findAllDonations(userId)
        +findDonationById(id, userId)
        +updateDonationStatus(id, status)
    }
    
    class ProductsService {
        +findAllProducts()
        +findProductById(id)
        +createOrder(userId, items)
        +findOrderById(id, userId)
        +updateOrderStatus(id, status)
    }
    
    class UsersService {
        +findById(id)
        +updateProfile(userId, dto)
        +createAddress(userId, dto)
        +getUserAddresses(userId)
    }
    
    class LogsService {
        +log(level, category, message, metadata, userId)
        +getLogs(filters)
        +exportLogs(format)
    }
    
    %% ===== HOOKS FRONTEND =====
    
    class useRepairs {
        +repairs: RepairRequest[]
        +loading: boolean
        +error: string
        +fetchRepairs()
        +createRepair(repairData)
    }
    
    class useDonations {
        +donations: Donation[]
        +loading: boolean
        +error: string
        +fetchDonations()
        +createDonation(donationData)
    }
    
    class useProducts {
        +products: ReconditionedProduct[]
        +loading: boolean
        +error: string
        +fetchProducts()
    }
    
    class useUserData {
        +userRepairs: RepairRequest[]
        +userOrders: Order[]
        +userDonations: Donation[]
        +loading: boolean
        +error: string
        +fetchUserData()
    }
    
    %% ===== RELATIONS ENTRE ENTITÉS =====
    
    User ||--o{ Address : has
    User ||--o{ RepairRequest : creates
    User ||--o{ Donation : makes
    User ||--o{ Order : places
    
    RepairRequest ||--o{ Intervention : has
    RepairRequest ||--o{ RepairRequestHistory : tracks
    Intervention ||--o{ InterventionHistory : tracks
    
    Order ||--o{ OrderItem : contains
    Order ||--o{ OrderHistory : tracks
    ReconditionedProduct ||--o{ OrderItem : referenced_in
    
    Donation ||--o{ DonationHistory : tracks
    
    %% ===== RELATIONS AVEC ENUMS =====
    
    User --> UserRole : has
    RepairRequest --> RepairStatus : has
    Intervention --> InterventionStatus : has
    Order --> OrderStatus : has
    Donation --> DonationStatus : has
    ReconditionedProduct --> ConditionRating : has
    
    %% ===== RELATIONS SERVICES =====
    
    AuthService --> User : manages
    RepairsService --> RepairRequest : manages
    RepairsService --> Intervention : manages
    DonationsService --> Donation : manages
    ProductsService --> ReconditionedProduct : manages
    ProductsService --> Order : manages
    UsersService --> User : manages
    UsersService --> Address : manages
    LogsService --> User : logs_actions
    
    %% ===== RELATIONS FRONTEND =====
    
    AuthContext --> User : manages
    RepairForm --> RepairRequest : creates
    DonationForm --> Donation : creates
    ProductCard --> ReconditionedProduct : displays
    OrderTracking --> Order : tracks
    Dashboard --> User : displays_data
    
    useRepairs --> RepairRequest : manages
    useDonations --> Donation : manages
    useProducts --> ReconditionedProduct : manages
    useUserData --> User : manages_data
```

## Description des principales classes

### Entités Backend (Base de données)

1. **User** : Utilisateur principal du système avec différents rôles (ADMIN, PRO, CLIENT)
2. **RepairRequest** : Demande de réparation d'appareil électroménager
3. **Intervention** : Intervention technique sur une demande de réparation
4. **ReconditionedProduct** : Produit reconditionné disponible à la vente
5. **Order** : Commande de produits reconditionnés
6. **Donation** : Don d'appareil électroménager
7. **Address** : Adresse de l'utilisateur

### Composants Frontend

1. **AuthContext** : Gestion de l'authentification et du contexte utilisateur
2. **RepairForm** : Formulaire de création de demande de réparation
3. **DonationForm** : Formulaire de création de don
4. **ProductCard** : Affichage d'un produit reconditionné
5. **OrderTracking** : Suivi de commande
6. **Dashboard** : Tableau de bord utilisateur

### Services Backend

1. **AuthService** : Gestion de l'authentification et des utilisateurs
2. **RepairsService** : Gestion des réparations et interventions
3. **DonationsService** : Gestion des dons
4. **ProductsService** : Gestion des produits et commandes
5. **UsersService** : Gestion des profils utilisateurs
6. **LogsService** : Système de logs

### Hooks Frontend

1. **useRepairs** : Gestion des réparations côté client
2. **useDonations** : Gestion des dons côté client
3. **useProducts** : Gestion des produits côté client
4. **useUserData** : Gestion des données utilisateur

## Flux principaux

1. **Authentification** : User → AuthService → AuthContext
2. **Réparation** : User → RepairForm → RepairsService → RepairRequest
3. **Don** : User → DonationForm → DonationsService → Donation
4. **Achat** : User → ProductCard → ProductsService → Order
5. **Suivi** : Order → OrderTracking → ProductsService

Ce diagramme représente l'architecture complète de l'application DeDePanne avec toutes les entités, services et composants identifiés dans le code. 