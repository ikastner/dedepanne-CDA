# Conception UML & Merise – Dédépanne

---

## 1. Diagramme de classes (PlantUML)

```plantuml
@startuml
class Utilisateur {
  +id: int
  +email: string
  +motDePasse: string
  +role: string
  +prenom: string
  +nom: string
  +telephone: string
}

class Adresse {
  +id: int
  +ligne1: string
  +ville: string
  +codePostal: string
  +departement: string
  +estPrincipale: bool
}

class DemandeReparation {
  +id: int
  +reference: string
  +descriptionPanne: string
  +urgence: string
  +statut: string
  +prixBase: float
  +coutSupp: float
  +coutTotal: float
  +datePlanifiee: date
}

class ProduitReconditionne {
  +id: int
  +nom: string
  +prix: float
  +etat: string
  +garantie: int
  +stock: int
}

class LogApplication {
  +id: ObjectId
  +niveau: string
  +categorie: string
  +message: string
  +date: datetime
}

Utilisateur "1" -- "*" Adresse
Utilisateur "1" -- "*" DemandeReparation
Utilisateur "1" -- "*" LogApplication
DemandeReparation "*" -- "1" ProduitReconditionne : concerne

@enduml
```

**Explication :**
Ce diagramme de classes représente les principales entités du backend Dédépanne et leurs relations.

---

## 2. Diagramme de cas d'utilisation (PlantUML)

```plantuml
@startuml
actor Client
actor Technicien
actor Admin

usecase "S'inscrire" as UC1
usecase "Se connecter" as UC2
usecase "Demander une réparation" as UC3
usecase "Consulter ses demandes" as UC4
usecase "Acheter un produit" as UC5
usecase "Donner un appareil" as UC6
usecase "Gérer les utilisateurs" as UC7
usecase "Consulter les logs" as UC8

Client --> UC1
Client --> UC2
Client --> UC3
Client --> UC4
Client --> UC5
Client --> UC6
Technicien --> UC2
Technicien --> UC4
Technicien --> UC3
Admin --> UC2
Admin --> UC7
Admin --> UC8
@enduml
```

**Explication :**
Ce diagramme montre les interactions principales entre les acteurs et le système.

---

## 3. Diagramme d'activité (PlantUML)

```plantuml
@startuml
start
:Client remplit le formulaire de demande de réparation;
:Le système vérifie les informations;
if (Appareil éligible ?) then (oui)
  :Création de la demande;
  :Notification du technicien;
  :Planification de l'intervention;
else (non)
  :Message d'erreur au client;
endif
stop
@enduml
```

**Explication :**
Exemple du flux de création d'une demande de réparation.

---

## 4. MCD (Modèle Conceptuel de Données – Merise)

- **Utilisateur** (id, email, motDePasse, role, prenom, nom, telephone)
- **Adresse** (id, ligne1, ville, codePostal, departement, estPrincipale)
- **DemandeReparation** (id, reference, descriptionPanne, urgence, statut, prixBase, coutSupp, coutTotal, datePlanifiee)
- **ProduitReconditionne** (id, nom, prix, etat, garantie, stock)
- **LogApplication** (id, niveau, categorie, message, date)

**Associations :**
- Un utilisateur possède plusieurs adresses
- Un utilisateur effectue plusieurs demandes de réparation
- Un utilisateur peut générer plusieurs logs
- Une demande de réparation peut concerner un produit reconditionné

---

## 5. MLD (Modèle Logique de Données – Merise)

- Utilisateur(id, email, motDePasse, role, prenom, nom, telephone)
- Adresse(id, userId, ligne1, ville, codePostal, departement, estPrincipale)
- DemandeReparation(id, userId, reference, descriptionPanne, urgence, statut, prixBase, coutSupp, coutTotal, datePlanifiee, produitId)
- ProduitReconditionne(id, nom, prix, etat, garantie, stock)
- LogApplication(id, userId, niveau, categorie, message, date)

---

## 6. MPD (Modèle Physique de Données – Merise)

- Table utilisateurs (clé primaire : id)
- Table adresses (clé primaire : id, clé étrangère : userId)
- Table demandes_reparation (clé primaire : id, clé étrangère : userId, produitId)
- Table produits_reconditionnes (clé primaire : id)
- Collection logs_applications (clé primaire : id, clé étrangère : userId)

---

**Tous les diagrammes sont adaptés à l'application Dédépanne et peuvent être exportés ou visualisés avec PlantUML ou un outil Merise.** 