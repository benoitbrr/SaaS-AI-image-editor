# 🚀 Configuration Vercel - Variables d'Environnement

## Variables à configurer

Allez dans **Settings > Environment Variables** de votre projet Vercel et ajoutez :

### 1. NEXT_PUBLIC_SUPABASE_URL
- Valeur : Votre URL Supabase
- Environnements : Production, Preview, Development

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY  
- Valeur : Votre clé anon Supabase
- Environnements : Production, Preview, Development

### 3. SUPABASE_SERVICE_ROLE_KEY
- Valeur : Votre clé service role Supabase
- Environnements : Production, Preview, Development

### 4. REPLICATE_API_TOKEN
- Valeur : Votre token Replicate
- Environnements : Production, Preview, Development

## Trouvez vos clés

- **Supabase** : Dashboard > Settings > API
- **Replicate** : Account Settings > API Tokens

Après configuration, redéployez votre projet.
