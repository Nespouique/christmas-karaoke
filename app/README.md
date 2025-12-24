# 🎄 Karaoké du Père Noël

Une application festive pour animer vos soirées de Noël en famille ! Sélectionnez aléatoirement un participant avec la roue et proposez-lui un chant de Noël à interpréter.

## ✨ Fonctionnalités

### 🎡 Onglet Roue
- Roue de la fortune avec les prénoms des participants
- Animation fluide avec décélération naturelle
- Si le nombre de participants ne permet pas une alternance de couleurs, une case "Rejoue" est ajoutée
- Modal de félicitations avec la photo du gagnant et une phrase de motivation aléatoire
- Attribution automatique d'un chant de Noël depuis la liste

### 👥 Onglet Participants
- Gestion des participants (ajout, modification, suppression)
- Upload de photo personnalisée
- Attribution automatique de couleurs pour la roue
- Affichage en grille avec avatars colorés

### 🎵 Onglet Chants
- Liste des chants de Noël avec liens Spotify
- Ajout de nouveaux chants via URL Spotify
- Ouverture directe dans Spotify
- Suppression facile des chants

## 🚀 Installation

```bash
# Cloner le repository
git clone [votre-repo]

# Aller dans le dossier de l'application
cd christmas-karaoke/app

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

## 🛠️ Technologies utilisées

- **React 19** - Framework UI
- **Vite** - Build tool
- **TypeScript** - Typage statique
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Composants UI
- **Lucide React** - Icônes
- **Sonner** - Notifications toast
- **Local Storage** - Persistance des données

## 📱 Utilisation

1. **Ajoutez des participants** dans l'onglet "Participants"
   - Cliquez sur le bouton "+" pour ajouter un nouveau participant
   - Uploadez une photo et entrez le prénom

2. **Ajoutez des chants** dans l'onglet "Chants"
   - Cliquez sur "Ajouter un chant"
   - Collez un lien Spotify et renseignez le titre et l'artiste

3. **Lancez la roue** dans l'onglet "Roue"
   - Cliquez sur "Lancer la roue" 🎄
   - Le participant sélectionné découvrira son chant de Noël !

## 🎨 Personnalisation

Les couleurs de la roue peuvent être modifiées dans `src/types/index.ts` :

```typescript
export const WHEEL_COLORS = [
  '#E53935', // Rouge Noël
  '#43A047', // Vert sapin
  '#FDD835', // Or
  // ...
];
```

Les phrases de motivation sont dans le même fichier :

```typescript
export const DEFAULT_PUNCHLINES = [
  "Une voix d'ange de Noël",
  "Le prochain Mariah Carey !",
  // ...
];
```

## 🎅 Joyeux Noël !

Profitez de cette application pour passer un merveilleux moment en famille ! 🎄✨
