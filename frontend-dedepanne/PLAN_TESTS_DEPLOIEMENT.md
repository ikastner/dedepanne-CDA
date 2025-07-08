# Activité-type n°3 : Préparer le déploiement d'une application sécurisée

## Exemple n°1 : Préparer et exécuter les plans de tests d'une application

### 1. Décrivez les tâches ou opérations que vous avez effectuées, et dans quelles conditions :

Avant de déployer mon application Dédépanne en production, j'ai préparé et exécuté un plan de tests complet afin de m'assurer que toutes les fonctionnalités développées répondent correctement aux besoins et qu'aucun bug majeur ne subsiste. Voici les étapes que j'ai menées :

#### • Définition des scénarios de test à partir des spécifications :
J'ai relu le PRD et les user stories du projet pour en extraire tous les cas d'utilisation à vérifier. J'ai listé par écrit chaque fonctionnalité et imaginé les scénarios de test associés. Par exemple : "Création d'une demande de réparation réussie" (chemin nominal où un client planifie une intervention et tout fonctionne), "Création d'une demande de réparation – cas date indisponible" (message d'erreur si le créneau demandé est déjà occupé), "Connexion – mot de passe incorrect" (vérifier le message d'erreur et l'absence d'accès), etc. Pour chaque fonctionnalité (prise de rendez-vous, gestion du stock de produits reconditionnés, don d'appareil, etc.), j'ai envisagé le chemin nominal et au moins un chemin alternatif/erreur. Au total, j'ai identifié plusieurs dizaines de scénarios de tests couvrant l'ensemble du périmètre.

#### • Élaboration du plan de test (documentation) :
J'ai formalisé ces scénarios dans un plan de test structuré. Dans un tableau, j'ai créé une ligne par cas de test avec : un identifiant, l'objectif du test, les prérequis (état du système avant test, ex : "un compte client existant"), les étapes précises de réalisation (ex : "1. Aller sur la page d'accueil, 2. Cliquer sur 'Nouvelle réparation', 3. Remplir le formulaire…") et le résultat attendu pour chaque étape ou en final. Par exemple, pour le test "Annulation de réparation par le client", le résultat attendu final était "La réparation passe au statut 'Annulée' et n'apparaît plus dans la liste active du client, un email de confirmation est envoyé". J'ai pris soin d'écrire ce plan de test de manière claire, comme si une autre personne devait l'exécuter.

#### • Préparation des données et de l'environnement de test :
J'ai créé un environnement de pré-production identique à la prod cible (base de données dédiée, configuration identique) et j'y ai déployé la dernière version de l'application. J'ai également préparé des données de test cohérentes : par exemple, j'ai créé via des scripts SQL quelques comptes clients fictifs, dont un "client de démonstration" qui servirait pour les tests de parcours client, et des enregistrements correspondants (quelques réparations déjà planifiées, quelques produits reconditionnés en stock, etc.). Ceci pour éviter de partir d'une base totalement vide, ce qui ne refléterait pas la réalité d'utilisation. J'ai documenté l'état initial de la base de test pour chaque scénario si nécessaire (par ex., pour tester la modification d'un stock, il fallait qu'il y ait déjà un stock existant).

#### • Exécution des tests fonctionnels :
J'ai ensuite déroulé manuellement chaque cas de test du plan sur l'application déployée en pré-production. Concrètement, j'ai simulé le comportement d'un utilisateur final : navigation via un navigateur web sur le front-end Next.js, utilisation de l'application comme un client ou comme le technicien selon le scénario, et observation des résultats. J'ai coché au fur et à mesure les étapes réussies et noté toute divergence. Par exemple, lors du test de "filtre des réparations par date", j'ai constaté qu'un filtre ne fonctionnait pas correctement sur la plage de dates – un bug que j'ai immédiatement consigné. À chaque test, je vérifiais non seulement l'interface visible, mais aussi l'impact en base de données (via pgAdmin) pour les opérations critiques : par exemple, après un test de création de réparation, je vérifiais que l'enregistrement correspondant apparaissait bien en base avec les bons attributs, et que le log était créé en MongoDB.

#### • Identification et suivi des anomalies :
Chaque écart entre le résultat attendu et le résultat observé a été noté comme une anomalie. J'ai tenu un fichier de suivi des bugs rencontrés durant la campagne de test. Pour chacun, j'ai noté : description du problème, étapes pour le reproduire, gravité (bloquant, majeur, mineur), et si possible j'ai tenté d'analyser la cause. Par exemple, j'ai découvert un bug où la suppression d'un produit reconditionné ne rafraîchissait pas automatiquement la liste à l'écran – bug mineur d'UX. En revanche, un bug plus grave trouvé : l'application permettait de planifier deux réparations à la même date et même heure pour le technicien (conflit d'agenda non détecté). Je l'ai qualifié de majeur car cela pourrait arriver en prod et causer un vrai problème d'organisation. J'ai ensuite corrigé immédiatement les anomalies les plus simples (ce qui a donné lieu à un patch déployé sur l'environnement de test), et planifié de corriger les plus complexes. J'ai rejoué les tests sur les parties corrigées pour m'assurer que le correctif était bon.

En complément des tests purement fonctionnels, j'ai procédé à quelques tests de sécurité basiques dans le cadre de cette préparation. Par exemple, j'ai tenté des entrées malveillantes dans les formulaires (injection de code `<script>` dans un champ de description, très long texte pour tester la robustesse, caractères spéciaux inattendus) afin de vérifier que l'application ne les acceptait pas ou les gérait correctement. J'ai aussi vérifié les restrictions d'accès : en me connectant en tant que client, j'ai tenté d'accéder à des pages réservées au technicien (URL directes), et l'application m'a bien renvoyé une page de refus (statut 403) – preuve que le système d'authentification et d'autorisation était effectif. Ces tests m'ont rassuré sur le fait que les principaux garde-fous de sécurité étaient en place.

### 2. Précisez les moyens utilisés :

#### • Documentation de test :
Un fichier Excel (ou Google Sheets) a été utilisé pour rédiger le plan de test et consigner les résultats. Chaque ligne correspondait à un cas de test, avec des colonnes pour les étapes, les résultats attendus et obtenus, et un statut (Succès/Échec). Ce support m'a permis de garder une trace écrite et exploitable de l'avancée de mes tests.

#### • Environnement de pré-production :
Une machine virtuelle Linux sur laquelle l'application a été déployée, avec une configuration identique à l'environnement de production visé (même version de PostgreSQL, de Node.js, variables d'environnement de test). Cet environnement a servi de bac à sable pour exécuter les plans de test en conditions quasi réelles sans risque pour les données de production (inexistantes à ce stade, puisque pas encore déployé chez le client).

#### • Outils de test manuel :
Principal outil = le navigateur web (Chrome et Firefox) pour tester l'interface utilisateur côté client et côté technicien. J'ai également utilisé mon smartphone pour vérifier l'affichage responsive et le comportement en mobile (puisque l'application devait être utilisable sur le terrain par le technicien via son téléphone). Pour les tests d'API plus techniques, j'ai fait appel à Postman – par exemple, pour simuler un appel API direct en cas d'utilisation future d'une appli mobile, ou pour tester certaines validations serveurs sans passer par l'UI.

#### • Outils de suivi des anomalies :
Un second onglet dans mon fichier Excel listait les anomalies identifiées. Cependant, pour faire les choses proprement, j'ai aussi expérimenté l'outil Azure DevOps (Boards) en mode solo : j'ai créé des Work Items de type Bug pour chaque anomalie notable, histoire de m'habituer à cet usage. Même si je suis seul, ça m'a servi à prioriser les corrections (j'ai attribué des niveaux de sévérité et j'ai trié la liste pour m'attaquer d'abord aux bloquants).

#### • Outils complémentaires :
J'ai mis en place une stratégie de tests automatisés complète pour garantir la qualité de l'application. Pour les tests E2E, j'ai utilisé **Playwright** qui permet d'automatiser les tests sur plusieurs navigateurs (Chrome, Firefox, Safari) et appareils mobiles. J'ai créé des scripts de test automatisés pour tous les flux critiques : authentification, création de demandes de réparation, achat de produits reconditionnés, et dons d'appareils. Ces tests s'exécutent automatiquement dans le pipeline CI/CD via GitHub Actions.

Pour les tests frontend, j'ai utilisé **Jest** avec **React Testing Library** pour tester les composants React de manière isolée, en simulant les interactions utilisateur et en vérifiant le comportement attendu. J'ai également mis en place des tests unitaires backend avec Jest pour les services NestJS, couvrant l'authentification, la gestion des réparations, et les validations métier.

En complément, j'ai utilisé les **DevTools du navigateur** pour analyser les erreurs JavaScript et les échanges réseau en temps réel lors du développement et du debug des tests. Cette approche automatisée m'a permis de détecter rapidement les régressions et de maintenir une qualité élevée du code.

---

## 📋 PLAN DE TESTS DÉTAILLÉ - DÉDÉPANNE

### **Tests d'Authentification**

| ID | Test | Prérequis | Étapes | Résultat Attendu |
|---|---|---|---|---|
| AUTH-001 | Connexion réussie | Compte client existant | 1. Aller sur /login<br>2. Saisir email/password valides<br>3. Cliquer "Se connecter" | Redirection vers dashboard, token JWT créé |
| AUTH-002 | Connexion échec - mauvais mot de passe | Compte client existant | 1. Aller sur /login<br>2. Saisir email correct + mauvais password<br>3. Cliquer "Se connecter" | Message d'erreur, pas de redirection |
| AUTH-003 | Inscription nouveau client | Aucun | 1. Aller sur /register<br>2. Remplir formulaire complet<br>3. Valider | Compte créé, email de confirmation |
| AUTH-004 | Accès page admin en tant que client | Compte client connecté | 1. Se connecter en tant que client<br>2. Aller sur /admin | Redirection 403, message d'erreur |

### **Tests de Réparations**

| ID | Test | Prérequis | Étapes | Résultat Attendu |
|---|---|---|---|---|
| REP-001 | Création demande réparation | Client connecté | 1. Aller sur /services<br>2. Remplir formulaire réparation<br>3. Valider | Demande créée, email de confirmation |
| REP-002 | Planification intervention | Demande réparation existante | 1. Technicien connecté<br>2. Sélectionner créneau disponible<br>3. Confirmer | Statut "planifié", notification client |
| REP-003 | Conflit d'agenda | Deux réparations même créneau | 1. Planifier réparation 1<br>2. Tenter réparation 2 même créneau | Message d'erreur, créneau non disponible |
| REP-004 | Annulation par client | Réparation planifiée | 1. Client connecté<br>2. Aller sur ses réparations<br>3. Annuler | Statut "annulée", email confirmation |

### **Tests de Produits Reconditionnés**

| ID | Test | Prérequis | Étapes | Résultat Attendu |
|---|---|---|---|---|
| PROD-001 | Consultation catalogue | Aucun | 1. Aller sur /reconditioned<br>2. Parcourir les produits | Liste des produits avec filtres |
| PROD-002 | Filtrage par catégorie | Catalogue avec produits | 1. Sélectionner catégorie "Lave-linge"<br>2. Appliquer filtre | Seuls les lave-linges affichés |
| PROD-003 | Achat produit | Client connecté + produit en stock | 1. Sélectionner produit<br>2. Ajouter au panier<br>3. Finaliser commande | Commande créée, stock décrémenté |
| PROD-004 | Produit hors stock | Produit avec stock = 0 | 1. Tenter d'acheter produit | Message "indisponible", bouton désactivé |

### **Tests de Dons d'Appareils**

| ID | Test | Prérequis | Étapes | Résultat Attendu |
|---|---|---|---|---|
| DON-001 | Évaluation appareil | Aucun | 1. Aller sur /donations<br>2. Remplir formulaire évaluation<br>3. Soumettre | Estimation prix, bon d'achat généré |
| DON-002 | Planification collecte | Don validé | 1. Client connecté<br>2. Choisir créneau collecte<br>3. Confirmer | Collecte planifiée, email confirmation |
| DON-003 | Suivi reconditionnement | Appareil collecté | 1. Admin connecté<br>2. Mettre à jour statut<br>3. Notifier client | Statut mis à jour, notification client |

### **Tests de Sécurité**

| ID | Test | Prérequis | Étapes | Résultat Attendu |
|---|---|---|---|---|
| SEC-001 | Injection SQL | Formulaire de recherche | 1. Saisir `' OR 1=1 --`<br>2. Soumettre | Erreur 400, pas d'exécution SQL |
| SEC-002 | XSS | Champ description | 1. Saisir `<script>alert('test')</script>`<br>2. Sauvegarder | Script échappé, pas d'exécution |
| SEC-003 | CSRF | Session active | 1. Créer requête malveillante<br>2. Tenter exécution | Token CSRF requis, requête rejetée |
| SEC-004 | Rate limiting | API endpoints | 1. Envoyer 100 requêtes/min<br>2. Continuer | Limitation activée, erreur 429 |

### **Tests de Performance**

| ID | Test | Prérequis | Étapes | Résultat Attendu |
|---|---|---|---|---|
| PERF-001 | Temps de réponse API | Serveur en charge | 1. Mesurer temps réponse<br>2. Comparer baseline | < 200ms pour 95% des requêtes |
| PERF-002 | Charge base données | 1000 utilisateurs simultanés | 1. Simuler charge<br>2. Monitorer PostgreSQL | Pas de timeout, < 80% CPU |
| PERF-003 | Upload images | Fichiers 5MB | 1. Upload 10 images<br>2. Mesurer temps | < 30s total, compression OK |

### **Tests d'Interface Utilisateur**

| ID | Test | Prérequis | Étapes | Résultat Attendu |
|---|---|---|---|---|
| UI-001 | Responsive design | Navigateur mobile | 1. Tester sur mobile<br>2. Vérifier adaptation | Interface adaptée, navigation OK |
| UI-002 | Accessibilité | Lecteur d'écran | 1. Tester avec NVDA<br>2. Vérifier contrastes | Conforme WCAG 2.1 AA |
| UI-003 | Navigation | Utilisateur connecté | 1. Tester tous les liens<br>2. Vérifier breadcrumbs | Navigation fluide, pas de 404 |

---

## 🛠️ OUTILS DE TEST UTILISÉS

### **Environnement de Test**
- **Docker Compose** : Environnement complet (PostgreSQL + MongoDB + Backend + Frontend)
- **Base de données de test** : Données fictives cohérentes
- **Variables d'environnement** : Configuration séparée dev/test/prod

### **Outils de Test**
- **Postman** : Tests API REST
- **Chrome DevTools** : Debug frontend, monitoring réseau
- **pgAdmin** : Vérification base PostgreSQL
- **MongoDB Compass** : Vérification logs MongoDB
- **Jest** : Tests unitaires backend et frontend
- **React Testing Library** : Tests de composants React
- **Playwright** : Tests E2E automatisés multi-navigateurs
- **Lighthouse** : Performance et accessibilité

### **Monitoring**
- **Prometheus** : Métriques temps réel
- **Grafana** : Dashboards de monitoring
- **Winston** : Logs structurés
- **Sentry** : Tracking d'erreurs (optionnel)

---

## 📊 MÉTRIQUES DE QUALITÉ

### **Couverture de Tests**
- **Tests unitaires** : > 80% de couverture
- **Tests d'intégration** : Tous les endpoints API
- **Tests fonctionnels** : 100% des user stories
- **Tests de sécurité** : OWASP Top 10

### **Performance**
- **Temps de réponse** : < 200ms (95e percentile)
- **Disponibilité** : > 99.9%
- **Taux d'erreur** : < 0.1%
- **Score Lighthouse** : > 90

### **Sécurité**
- **Vulnérabilités critiques** : 0
- **Vulnérabilités majeures** : 0
- **Conformité RGPD** : 100%
- **Chiffrement** : TLS 1.3 partout

---

**Dédépanne - Tests de déploiement sécurisé** 🔒✅ 