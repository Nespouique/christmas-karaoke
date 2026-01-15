# Karaoké de Noël

Application web festive pour animer vos soirées karaoké en famille ! Une roue interactive désigne aléatoirement qui chantera le prochain chant de Noël.

## Fonctionnalités

### Roue de la Fortune
- Roue animée avec effets sonores (ticks progressifs)
- Cliquez sur la roue ou le bouton pour lancer
- Segment "Rejoue !" ajouté automatiquement pour alterner les couleurs
- Animation fluide avec courbe de décélération réaliste

### Gestion des Participants
- Ajout/modification/suppression de participants
- Photos de profil avec recadrage intégré
- Couleurs automatiquement attribuées

### Bibliothèque de Chants
- Catalogue de chants de Noël avec liens Spotify
- Proposition aléatoire d'un chant au gagnant
- Lien direct vers Spotify pour lancer la musique

### Expérience Utilisateur
- Interface responsive optimisée mobile
- PWA installable sur Android et iOS
- Thème festif rouge et vert
- Animation de neige tombante

## Stack Technique

- **Frontend** : React 19 + TypeScript + Vite
- **Styling** : Tailwind CSS 4 + shadcn/ui
- **Backend** : Express.js + Prisma ORM
- **Base de données** : PostgreSQL
- **Déploiement** : Docker Compose + Nginx

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                        │
├─────────────────┬─────────────────┬─────────────────────┤
│   Frontend      │    Backend      │    PostgreSQL       │
│   (Nginx)       │   (Express)     │    + Prisma Studio  │
│   Port 80       │   Port 3001     │    Port 5555        │
└─────────────────┴─────────────────┴─────────────────────┘
```

## Installation

### Prérequis

- Docker et Docker Compose

### Déploiement avec Docker Compose

1. Créez un fichier `docker-compose.yml` :

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: christmas-karaoke-db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=karaoke
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-votre_mot_de_passe}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d karaoke"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  server:
    image: nespouique/christmas-karaoke-server:latest
    container_name: christmas-karaoke-server
    expose:
      - "3001"
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD:-votre_mot_de_passe}@postgres:5432/karaoke
      - NODE_ENV=production
      - PORT=3001
    restart: unless-stopped

  frontend:
    image: nespouique/christmas-karaoke:latest
    container_name: christmas-karaoke
    ports:
      - "80:80"
    depends_on:
      - server
    restart: unless-stopped

  prisma-studio:
    image: nespouique/christmas-karaoke-server:latest
    container_name: christmas-karaoke-studio
    command: prisma studio --port 5555 --browser none
    ports:
      - "5555:5555"
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD:-votre_mot_de_passe}@postgres:5432/karaoke
    restart: unless-stopped

volumes:
  postgres_data:
```

2. Lancez les services :

```bash
# Définir le mot de passe PostgreSQL
export POSTGRES_PASSWORD=votre_mot_de_passe_securise

# Lancer les conteneurs
docker-compose up -d
```

3. Accédez à l'application :
   - **Application** : http://localhost
   - **Prisma Studio** (admin DB) : http://localhost:5555

### Développement Local

```bash
# Cloner le repo
git clone https://github.com/Nespouique/christmas-karaoke.git
cd christmas-karaoke

# Backend
cd server
npm install
cp .env.example .env  # Configurer DATABASE_URL
npm run dev

# Frontend (dans un autre terminal)
cd app
npm install
npm run dev
```

## Structure du Projet

```
christmas-karaoke/
├── app/                      # Frontend React
│   ├── src/
│   │   ├── components/       # Composants React
│   │   │   ├── ui/           # Composants shadcn/ui
│   │   │   └── tabs/         # Onglets principaux
│   │   ├── lib/              # API client et utilitaires
│   │   └── types/            # Types TypeScript
│   └── public/               # Assets statiques (icônes PWA)
├── server/                   # Backend Express
│   ├── prisma/
│   │   ├── schema.prisma     # Schéma de la base de données
│   │   └── migrations/       # Migrations SQL
│   └── src/
│       ├── routes/           # Routes API
│       └── lib/              # Prisma client
├── Dockerfile                # Build frontend (Nginx)
├── docker-compose.yml        # Orchestration Docker
└── nginx.conf                # Configuration reverse proxy
```

## API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/participants` | Liste des participants |
| POST | `/api/participants` | Ajouter un participant |
| PUT | `/api/participants/:id` | Modifier un participant |
| DELETE | `/api/participants/:id` | Supprimer un participant |
| GET | `/api/songs` | Liste des chants |
| POST | `/api/songs` | Ajouter un chant |
| DELETE | `/api/songs/:id` | Supprimer un chant |
| GET | `/api/punchlines` | Liste des punchlines |
| GET | `/api/punchlines/random` | Punchline aléatoire |
| GET | `/api/spotify/info/:trackId` | Infos d'un morceau Spotify |

## Scripts Disponibles

### Frontend (`app/`)
```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualisation du build
npm run lint     # Vérification ESLint
```

### Backend (`server/`)
```bash
npm run dev           # Serveur de développement
npm run build         # Compilation TypeScript
npm run start         # Lancer en production
npm run prisma:studio # Interface admin DB
```

## Licence

MIT
