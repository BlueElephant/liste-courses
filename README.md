# 🛒 Ma liste de courses — PWA offline

Application de liste de courses qui fonctionne **100% hors-ligne** sur iPhone,
sans App Store, sans backend, sans compte.

## Fichiers

```
liste-courses/
├── index.html      ← App principale
├── style.css       ← Styles
├── app.js          ← Logique + localStorage
├── sw.js           ← Service Worker (offline)
├── manifest.json   ← Metadata PWA
├── icon-192.png    ← Icône app
└── icon-512.png    ← Icône app (grande)
```

## Déploiement sur GitHub Pages

1. Créer un repo public sur github.com
2. Uploader tous ces fichiers (drag & drop ou `git push`)
3. Settings → Pages → Source: `main` → Save
4. Attendre ~30s → `https://TONPSEUDO.github.io/REPO`

## Installation sur iPhone

1. Ouvrir l'URL dans **Safari** (pas Chrome ni Firefox)
2. Icône Partager → **"Sur l'écran d'accueil"**
3. Nommer l'app → Ajouter

L'app tourne ensuite **complètement offline**, les données sont
stockées localement sur l'appareil.

## Fonctionnalités

- Ajouter des articles avec catégorie
- Cocher / décocher
- Filtrer par catégorie
- Supprimer les cochés
- Barre de progression
- Persistance automatique (localStorage)
- Mode offline complet (Service Worker)
