# Éditeur d'Images avec IA

Application Next.js pour transformer des images avec l'intelligence artificielle en utilisant Replicate et Supabase.

## Technologies utilisées

- **Next.js 14** avec TypeScript
- **Supabase** pour le stockage d'images et la base de données
- **Replicate** pour la génération d'images avec IA
- **Tailwind CSS** pour le style

## Prérequis

- Node.js 18+ installé
- Un compte Supabase avec :
  - Deux buckets storage : `input-images` et `output-images`
  - Une table `projects` avec les colonnes : id (UUID), created_at (TIMESTAMP), input_image_url (TEXT), output_image_url (TEXT), prompt (TEXT), status (TEXT)
- Un compte Replicate avec un token API

## Installation

1. Clonez le repository et installez les dépendances :

```bash
npm install
```

2. Configurez les variables d'environnement dans `.env.local` (déjà créé)

## Configuration Supabase

### Créer les buckets de stockage

1. Allez dans **Storage** dans votre tableau de bord Supabase
2. Créez deux buckets publics :
   - `input-images`
   - `output-images`

### Créer la table projects

Exécutez cette requête SQL dans l'éditeur SQL de Supabase :

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  input_image_url TEXT NOT NULL,
  output_image_url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- Activer Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous
CREATE POLICY "Allow public read" ON projects
  FOR SELECT
  USING (true);

-- Permettre l'insertion à tous (ou ajustez selon vos besoins)
CREATE POLICY "Allow public insert" ON projects
  FOR INSERT
  WITH CHECK (true);
```

## Lancer le projet

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Fonctionnalités

1. **Upload d'image** : Sélectionnez une image depuis votre ordinateur
2. **Prompt de transformation** : Décrivez comment vous voulez transformer l'image
3. **Génération IA** : L'application utilise Replicate pour générer une nouvelle image
4. **Affichage et téléchargement** : Visualisez et téléchargez l'image générée

## Structure du projet

```
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts       # API route pour la génération d'images
│   ├── globals.css            # Styles globaux
│   ├── layout.tsx             # Layout principal
│   └── page.tsx               # Page d'accueil
├── lib/
│   └── supabase.ts            # Configuration Supabase
├── .env.local                 # Variables d'environnement
├── next.config.js             # Configuration Next.js
├── package.json               # Dépendances
├── tailwind.config.js         # Configuration Tailwind
└── tsconfig.json              # Configuration TypeScript
```

## Workflow de génération

1. L'utilisateur upload une image et entre un prompt
2. L'image est uploadée dans le bucket `input-images` de Supabase
3. L'URL publique de l'image est récupérée
4. Replicate génère une nouvelle image basée sur l'image d'origine et le prompt
5. L'image générée est téléchargée et uploadée dans le bucket `output-images`
6. Les informations sont sauvegardées dans la table `projects`
7. L'URL de l'image générée est retournée à l'utilisateur

## Notes importantes

- Les buckets Supabase doivent être configurés comme publics pour permettre l'accès aux URLs
- Le modèle Replicate utilisé est `google/nano-banana` (assurez-vous qu'il existe ou remplacez par un modèle valide)
- Les erreurs sont loggées dans la console du serveur pour faciliter le debugging

## Déploiement

Pour déployer sur Vercel :

```bash
npm run build
```

Assurez-vous d'ajouter toutes les variables d'environnement dans les paramètres de votre projet Vercel.
# SaaS-AI-image-editor
