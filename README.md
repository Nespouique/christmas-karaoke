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
- **Backend** : Supabase (PostgreSQL + Auth)
- **Déploiement** : Docker + Nginx

## Installation

### Prérequis

- Node.js 22+
- Un projet [Supabase](https://supabase.com) configuré

### Configuration Supabase

Créez les tables suivantes dans votre projet Supabase :

```sql
-- Table des participants
create table participants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  photo_url text,
  color text default '#E53935',
  created_at timestamptz default now()
);

-- Table des chants
create table songs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  artist text not null,
  spotify_url text not null,
  created_at timestamptz default now()
);

-- Table des punchlines
create table punchlines (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  created_at timestamptz default now()
);

-- Activer RLS sur toutes les tables
alter table participants enable row level security;
alter table songs enable row level security;
alter table punchlines enable row level security;

-- Policies pour accès public (ajustez selon vos besoins)
create policy "Public access" on participants for all using (true);
create policy "Public access" on songs for all using (true);
create policy "Public access" on punchlines for all using (true);
```

### Développement Local

```bash
# Cloner le repo
git clone https://github.com/votre-username/christmas-karaoke.git
cd christmas-karaoke/app

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase :
# VITE_SUPABASE_URL=https://votre-projet.supabase.co
# VITE_SUPABASE_ANON_KEY=votre-clé-anon

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Déploiement

### Docker

```bash
# Build de l'image
docker build \
  --build-arg VITE_SUPABASE_URL=https://votre-projet.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=votre-clé-anon \
  -t christmas-karaoke .

# Lancer le conteneur
docker run -d -p 80:80 christmas-karaoke
```

### Build Manuel

```bash
cd app
npm run build
# Les fichiers statiques sont générés dans ./dist
```

## Structure du Projet

```
christmas-karaoke/
├── app/                    # Application React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   │   ├── ui/         # Composants shadcn/ui
│   │   │   └── tabs/       # Onglets principaux
│   │   ├── lib/            # Utilitaires et Supabase
│   │   └── types/          # Types TypeScript
│   ├── public/             # Assets statiques (icônes PWA)
│   └── index.html
├── Dockerfile              # Build multi-stage
├── nginx.conf              # Configuration serveur
└── README.md
```

## Scripts Disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualisation du build
npm run lint     # Vérification ESLint
```

## Licence

MIT
