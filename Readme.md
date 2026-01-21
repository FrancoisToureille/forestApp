# Forest API — François TOUREILLE

## 1. Fonctionnalités réalisées pour le CRUD

J'ai d'abord analysé le projet pour le comparer à l'architecture de la dernière fois.
Approche hexagonale :

- `src/domain/` : modèles et logique métier (services)
- `src/application/` : ports (interfaces) + orchestration
- `src/infrastructure/` : adapters (repositories in-memory)
  Exemple : `TreeRepositoryAdapter` stocke les arbres **en mémoire** et attribue un UUID via `uuidv4()`.

- `src/presentation/` : controllers Express (routes)
- `src/tests/` : tests d'intégration

---

## 2. Fonctionnalités réalisées pour le CRUD

### 2.1 CRUD Arbres (`/tree`)

- **Lister** tous les arbres
- **Créer** un arbre
- **Consulter** un arbre par `uuid`
- **Mettre à jour** un arbre
- **Supprimer** un arbre

### 2.2 CRUD Forêts (`/forest`)

- **Lister** toutes les forêts
- **Créer** une forêt
- **Consulter** une forêt par `uuid`
- **Mettre à jour** une forêt
- **Supprimer** une forêt

* **Connaître** les espèces présentes dans une forêt

### 3 Absorption de CO₂

- Calcule le facteur de diversité selon le nombre d'espèces présentes

- Génère un **rapport texte** pour une forêt donnée, comprenant :
  - l’absorption par arbre (tonnes/an)
  - le total pour la forêt

- Détermine la **superficie** permettant de compenser x tonnes de C02 :
  - 222 tonnes de CO2 pour un hectare de forêt

---

## 4. API — Endpoints (référence OpenAPI)

La spec est disponible ici :

- `src/api/forest.yml`

### 4.1 Arbres

- `GET /tree` → liste des arbres
- `POST /tree` → crée un arbre
- `GET /tree/{uuid}` → récupère un arbre
- `PUT /tree/{uuid}` → met à jour un arbre
- `DELETE /tree/{uuid}` → supprime un arbre

**Body (création / update) — `NewTree`**

```json
{
  "birth": "2020-01-01",
  "species": "OAK",
  "exposure": "SUNNY",
  "carbonStorageCapacity": 25
}
```

### 4.2 Forêts

- `GET /forest`
- `POST /forest`
- `GET /forest/{uuid}`
- `PUT /forest/{uuid}`
- `DELETE /forest/{uuid}`

### 4.3 Rapport CO₂

- `GET /co2/{uuid}` → retourne un texte (Content-Type `text/plain`)

---

## 5. Tests

### 5.1 Lancer les tests

```bash
npm test
```

### 5.2 Couverture

Les tests unitaires pour les services ont bien été écris dans des fichier .spec
Les tests d'intégration ont bien été écris dans des fichiers du répertoire tests/

Les tests vérifient notamment :

- création d’arbres et de forêts via les services
- calcul du facteur de diversité
- génération du rapport d’absorption

---

### 5.2 Installation

Dans un terminal à la racine du projet :

```bash
npm install
```

### 5.3 Démarrer l’API

```bash
npm run dev
```

---


## 6. Tests API avec Bruno

Une collection Bruno `Tree/` a été crée dans `ForestBruno/` et il aurait fallu la compléter :

- `GET /tree`
- `POST /tree`
- `POST /forest`
- `GET /co2/{forestId}`

---
