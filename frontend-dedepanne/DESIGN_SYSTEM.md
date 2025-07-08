# Système de Design Dédépanne

Ce document décrit le système de design généralisé pour l'application Dédépanne, basé sur la page d'accueil et appliqué à toutes les pages.

## 🎨 Composants de Layout

### Header
Le composant `Header` est réutilisable et configurable :

```tsx
import { Header } from '@/components/layout'

<Header 
  showBackButton={true}
  backUrl="/"
  showNavigation={true}
  showAuthButtons={true}
  title="Titre de la page"
/>
```

**Props disponibles :**
- `showBackButton` : Affiche un bouton retour (défaut: false)
- `backUrl` : URL de retour (défaut: "/")
- `showNavigation` : Affiche la navigation principale (défaut: true)
- `showAuthButtons` : Affiche les boutons de connexion/inscription (défaut: true)
- `title` : Titre optionnel affiché à côté du logo

### Footer
Le composant `Footer` est standardisé et réutilisable :

```tsx
import { Footer } from '@/components/layout'

<Footer />
```

### PageContainer
Wrapper principal pour toutes les pages :

```tsx
import { PageContainer } from '@/components/ui'

<PageContainer 
  headerProps={{ showBackButton: true }}
  showFooter={true}
  className="bg-gray-50"
>
  {/* Contenu de la page */}
</PageContainer>
```

## 🎯 Composants UI

### BrandLogo
Composant pour afficher le logo de manière cohérente :

```tsx
import { BrandLogo } from '@/components/ui'

<BrandLogo 
  size="md" // "sm" | "md" | "lg"
  showText={true}
  href="/"
/>
```

## 🎨 Styles Cohérents

### Couleurs
```tsx
import { BRAND_COLORS } from '@/lib/constants'

// Couleur principale : #ffc200 (jaune dédépanne)
// Noir : #000000
// Blanc : #ffffff
```

### Typographie
- **Cocogoose** : Titres principaux (font-cocogoose)
- **Poppins** : Sous-titres et labels (font-poppins)
- **Helvetica** : Texte de contenu (font-helvetica)

### Boutons
```tsx
import { BUTTON_STYLES } from '@/lib/constants'

// Bouton principal
<Button className={BUTTON_STYLES.primary}>
  Action principale
</Button>

// Bouton outline
<Button className={BUTTON_STYLES.outline}>
  Action secondaire
</Button>
```

### Cartes
```tsx
import { CARD_STYLES } from '@/lib/constants'

// Carte par défaut
<Card className={CARD_STYLES.default}>
  Contenu
</Card>

// Carte élevée
<Card className={CARD_STYLES.elevated}>
  Contenu important
</Card>
```

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

### Logo Responsive
Le logo s'adapte automatiquement :
- **Mobile** : logo-smartphone.png
- **Tablet** : logo-tablet.png
- **Desktop** : logo.png

## 🔧 Utilisation

### 1. Page simple avec navigation
```tsx
import { PageContainer } from '@/components/ui'

export default function MaPage() {
  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-cocogoose font-black text-black">
          Mon titre
        </h1>
        {/* Contenu */}
      </div>
    </PageContainer>
  )
}
```

### 2. Page avec bouton retour
```tsx
export default function MaPage() {
  return (
    <PageContainer 
      headerProps={{
        showBackButton: true,
        backUrl: "/",
        title: "Ma Page"
      }}
    >
      {/* Contenu */}
    </PageContainer>
  )
}
```

### 3. Page sans footer
```tsx
export default function MaPage() {
  return (
    <PageContainer showFooter={false}>
      {/* Contenu */}
    </PageContainer>
  )
}
```

## 📋 Constantes Réutilisables

### Codes postaux éligibles
```tsx
import { ELIGIBLE_POSTAL_CODES } from '@/lib/constants'
```

### Zones de service
```tsx
import { SERVICE_ZONES } from '@/lib/constants'
```

### Appareils réparables
```tsx
import { REPAIRABLE_APPLIANCES } from '@/lib/constants'
```

## 🎯 Bonnes Pratiques

1. **Toujours utiliser PageContainer** pour les nouvelles pages
2. **Utiliser les constantes** pour les styles répétitifs
3. **Respecter la hiérarchie typographique** : Cocogoose > Poppins > Helvetica
4. **Maintenir la cohérence des couleurs** : Primary (#ffc200) pour les actions principales
5. **Utiliser les classes de spacing** définies dans les constantes
6. **Tester sur mobile** en priorité

## 🔄 Migration

Pour migrer une page existante :

1. Remplacer la structure HTML par `PageContainer`
2. Utiliser les composants `Header` et `Footer` standardisés
3. Appliquer les styles de boutons et cartes cohérents
4. Utiliser les constantes pour les données répétitives
5. Vérifier la responsivité

## 📝 Notes

- Le système est basé sur la page d'accueil qui servait déjà de référence
- Tous les composants sont TypeScript et supportent les props optionnelles
- Les styles sont cohérents avec l'identité visuelle de Dédépanne
- Le système est extensible pour de futures fonctionnalités 