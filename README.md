# 🎯 Dashboard Utilisateurs — React.js

> Application web de gestion d'utilisateurs avec animations avancées, persistance des données et interface professionnelle.

Développé dans le cadre d'un stage à **[Seomaniak](https://seomaniak.ma)** — Agence SEO & Marketing Digital  
**Stagiaire :** SNOUSSI Hossam · **Encadrant :** M. Imad Belak · **Période :** Juin – Juillet 2025

---

## 📸 Aperçu

| Dashboard | Utilisateurs | Analytics |
|-----------|-------------|-----------|
| Vue principale avec stats & ring chart | Liste complète + recherche | Insights & visualisations |

---

## ✨ Fonctionnalités

- ✅ **CRUD complet** — Ajout, affichage, modification et suppression d'utilisateurs
- 🔍 **Recherche & filtres** — Filtrage par rôle et recherche en temps réel
- 📊 **Statistiques dynamiques** — Compteurs animés, ring chart SVG, barres de progression
- 📍 **Répartition géographique** — Top 5 villes les plus représentées
- 🔔 **Notifications toast** — Système de notifications persistantes avec historique
- 💾 **Persistance localStorage** — Données sauvegardées au rechargement
- 📤 **Export CSV** — Téléchargement des données utilisateurs
- 🎨 **Thème personnalisable** — 6 couleurs d'accent au choix
- 💡 **Cursor glow** — Halo lumineux qui suit la souris (désactivable)
- ⚡ **Splash screen animé** — Écran de chargement avec particules

---

## 🛠️ Stack technologique

| Technologie | Version | Rôle |
|-------------|---------|------|
| **React.js** | 18.2 | Framework principal (composants, hooks) |
| **JavaScript ES6+** | — | Logique métier et interactions |
| **CSS3** | — | Animations, variables, glassmorphism |
| **localStorage API** | — | Persistance des données côté navigateur |
| **SVG natif** | — | Ring chart et visualisations |
| **Google Fonts** | — | Syne · Outfit · DM Mono |

---

## 🗂️ Structure des fichiers

```
seomaniak-dashboard/
├── public/
│   └── index.html          # Point d'entrée HTML
├── src/
│   ├── index.js            # Rendu React (ReactDOM)
│   ├── index.css           # Variables CSS globales
│   └── App.jsx             # Application complète
│       ├── Splash              # Écran de chargement animé
│       ├── Sidebar             # Navigation latérale
│       ├── DashboardView       # Vue principale
│       ├── UsersView           # Liste complète des utilisateurs
│       ├── AnalyticsView       # Page analytics
│       ├── NotifsView          # Historique des notifications
│       ├── SettingsView        # Paramètres & personnalisation
│       ├── RingChart           # Graphique SVG dynamique
│       ├── CityBars            # Barres géographiques
│       ├── StatCard            # Carte de statistique
│       ├── UserItem            # Élément de liste utilisateur
│       ├── Modal               # Fenêtre modale réutilisable
│       └── ToastContainer      # Notifications toast
├── package.json
└── README.md
```

---

## ⚛️ Hooks React utilisés

| Hook | Usage |
|------|-------|
| `useState` | Gestion de l'état local (formulaire, filtres, modales) |
| `useEffect` | Effets de bord (injection CSS, animation splash, clavier) |
| `useCallback` | Mémorisation des fonctions pour éviter les re-renders |
| `useRef` | Référence DOM pour le cursor glow |
| `useLocalStorage` *(custom)* | Encapsulation de la logique de persistance |

### Hook personnalisé — `useLocalStorage`

```js
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });

  const set = useCallback(v => {
    setVal(v);
    try { localStorage.setItem(key, JSON.stringify(v)); }
    catch {}
  }, [key]);

  return [val, set];
}
```

---

## 📄 Pages de l'application

| Page | Contenu |
|------|---------|
| **Dashboard** | Formulaire, liste, stats, ring chart, top villes |
| **Utilisateurs** | Liste complète avec recherche et suppression individuelle |
| **Analytics** | Statistiques approfondies, ratio, insights automatiques |
| **Notifications** | Historique de toutes les actions avec horodatage |
| **Paramètres** | Couleurs d'accent, toggles, export CSV, reset |

---

## 🚀 Lancer le projet

### Prérequis
- Node.js ≥ 16
- npm ≥ 8

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/snoussi-hossam/seomaniak-dashboard.git
cd seomaniak-dashboard

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement
npm start
```

L'application s'ouvre automatiquement sur **http://localhost:3000**

### Build production

```bash
npm run build
```

---

## 🏢 À propos de Seomaniak

**Seomaniak** est une agence internationale de marketing digital et de développement web, fondée en 2014 par **Imad Belak**. Présente à Oujda, Casablanca, Rabat et en Europe (Madrid), l'agence accompagne des centaines d'entreprises dans leur croissance digitale.

🌐 [seomaniak.ma](https://seomaniak.ma)

---

## 👨‍💻 Auteur

**SNOUSSI Hossam**  
Étudiant en DUT Web Design & Marketing Digital  
École Supérieure de Technologie d'Oujda (ESTO)

📧 snoussihoussam1@gmail.com  
📍 Oujda, Maroc

---

## 📚 Ressources

- [React.js Documentation](https://react.dev)
- [MDN Web Docs](https://developer.mozilla.org)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [SVG Specification — W3C](https://www.w3.org/TR/SVG2/)
- [Google Fonts](https://fonts.google.com)

---

<p align="center">
  Développé avec ❤️ durant le stage chez <strong>Seomaniak</strong> · Juin–Juillet 2025
</p>
