# Magic Image Refiner - Guide de Déploiement Vercel

## 🚀 Configuration des Variables d'Environnement sur Vercel

Pour que votre application fonctionne sur Vercel, vous devez configurer les variables d'environnement :

### Étape 1 : Accéder aux paramètres du projet

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet **SaaS-AI-image-editor**
3. Cliquez sur **Settings** (Paramètres)
4. Dans le menu de gauche, cliquez sur **Environment Variables**

### Étape 2 : Ajouter les variables d'environnement

Ajoutez les 4 variables suivantes (une par une) :

#### 1. NEXT_PUBLIC_SUPABASE_URL
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Votre URL Supabase (format: `https://xxxxx.supabase.co`)
- **Environment**: Cochez `Production`, `Preview`, et `Development`

#### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Votre clé anonyme Supabase (trouvée dans Settings > API)
- **Environment**: Cochez `Production`, `Preview`, et `Development`

#### 3. SUPABASE_SERVICE_ROLE_KEY
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Votre clé Service Role Supabase (trouvée dans Settings > API)
- **Environment**: Cochez `Production`, `Preview`, et `Development`

#### 4. REPLICATE_API_TOKEN
- **Name**: `REPLICATE_API_TOKEN`
- **Value**: Votre token API Replicate (format: `r8_xxxxx`)
- **Environment**: Cochez `Production`, `Preview`, et `Development`

### Étape 3 : Redéployer

Une fois toutes les variables ajoutées :

1. Allez dans l'onglet **Deployments**
2. Cliquez sur les **trois points** (...) du dernier déploiement
3. Sélectionnez **Redeploy**
4. Cochez **Use existing Build Cache** (optionnel)
5. Cliquez sur **Redeploy**

### ✅ Vérification

Après le redéploiement, votre application devrait fonctionner correctement !

---

## 📋 Checklist Supabase

Assurez-vous que votre projet Supabase est correctement configuré :

- [ ] Bucket `input-images` créé et **public**
- [ ] Bucket `output-images` créé et **public**
- [ ] Table `projects` créée avec les bonnes colonnes
- [ ] Policies RLS configurées (voir README.md)

---

## 🐛 Dépannage

### Erreur "supabaseKey is required"
→ Les variables d'environnement ne sont pas configurées sur Vercel

### Erreur lors de l'upload
→ Vérifiez que les buckets Supabase sont publics

### Erreur Replicate
→ Vérifiez que votre token Replicate est valide et a des crédits

---

## 🔗 Liens utiles

- [Documentation Vercel - Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Documentation Supabase - Storage](https://supabase.com/docs/guides/storage)
- [Documentation Replicate](https://replicate.com/docs)
