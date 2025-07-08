"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  Search,
  Filter
} from "lucide-react"
import PageContainer from "@/components/ui/PageContainer"
import { useAuth } from "@/lib/contexts/AuthContext"
import { useProducts } from "@/lib/contexts/ProductsContext"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { CARD_STYLES } from "@/lib/constants"

interface Product {
  id: number
  name: string
  brand: string
  category: string
  price: number
  original_price: number
  condition: string
  warranty_months: number
  stock_quantity: number
  is_available: boolean
  created_at: string
  savings_percentage: number
}

export default function AdminProductsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, isAdmin } = useAuth()
  const { products, loading: productsLoading, error } = useProducts()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterBrand, setFilterBrand] = useState("all")

  // Vérifier l'accès admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, isAdmin, router])

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || product.category === filterCategory
    const matchesBrand = filterBrand === "all" || product.brand === filterBrand
    
    return matchesSearch && matchesCategory && matchesBrand
  })

  const getConditionBadge = (condition: string) => {
    const conditionConfig = {
      excellent: { label: 'Excellent', className: 'bg-green-100 text-green-800' },
      very_good: { label: 'Très bon', className: 'bg-blue-100 text-blue-800' },
      good: { label: 'Bon', className: 'bg-yellow-100 text-yellow-800' },
      fair: { label: 'Correct', className: 'bg-orange-100 text-orange-800' }
    }
    
    const config = conditionConfig[condition as keyof typeof conditionConfig] || conditionConfig.good
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getAvailabilityBadge = (isAvailable: boolean) => {
    return isAvailable 
      ? <Badge className="bg-green-100 text-green-800">Disponible</Badge>
      : <Badge className="bg-red-100 text-red-800">Indisponible</Badge>
  }

  const handleEditProduct = (productId: number) => {
    router.push(`/pro/admin/products/${productId}/edit`)
  }

  const handleDeleteProduct = async (productId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      // TODO: Implémenter la suppression via l'API
      console.log('Suppression du produit:', productId)
    }
  }

  const handleViewProduct = (productId: number) => {
    router.push(`/pro/admin/products/${productId}`)
  }

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <PageContainer 
        headerProps={{
          showNavigation: true,
          showAuthButtons: true,
          isPro: true
        }}
        className="bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Vérification de l'accès...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  // Redirection si pas autorisé
  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <PageContainer 
        headerProps={{
          showNavigation: true,
          showAuthButtons: true,
          isPro: true
        }}
        className="bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="container mx-auto px-4 py-8">
          {/* En-tête */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-cocogoose font-black text-black">
                  Gestion des Produits
                </h1>
                <p className="text-gray-600 font-poppins">
                  Gérez les produits reconditionnés
                </p>
              </div>
              <Button 
                onClick={() => router.push('/pro/admin/products/new')}
                className="bg-primary text-black hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Produit
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Produits</CardTitle>
                  <Package className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{products.length}</div>
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Disponibles</CardTitle>
                  <Package className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">
                  {products.filter(p => p.is_available).length}
                </div>
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">En Stock</CardTitle>
                  <Package className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">
                  {products.filter(p => p.stock_quantity > 0).length}
                </div>
              </CardContent>
            </Card>

            <Card className={CARD_STYLES.elevated}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Valeur Stock</CardTitle>
                  <Package className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">
                  {products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0).toLocaleString()}€
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres et recherche */}
          <div className="mb-6">
            <Card className={CARD_STYLES.elevated}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">Toutes les catégories</option>
                      <option value="Lave-linge">Lave-linge</option>
                      <option value="Lave-vaisselle">Lave-vaisselle</option>
                      <option value="Réfrigérateur">Réfrigérateur</option>
                    </select>
                    <select
                      value={filterBrand}
                      onChange={(e) => setFilterBrand(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">Toutes les marques</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Bosch">Bosch</option>
                      <option value="Whirlpool">Whirlpool</option>
                      <option value="LG">LG</option>
                      <option value="Miele">Miele</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des produits */}
          <Card className={CARD_STYLES.elevated}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Produits Reconditionnés
              </CardTitle>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                  <p>Erreur lors du chargement des produits</p>
                  <p className="text-sm">{error}</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun produit trouvé</p>
                  <p className="text-sm">Créez votre premier produit</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Marque</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>État</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                          </div>
                        </TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.price}€</div>
                            <div className="text-sm text-gray-500 line-through">{product.original_price}€</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{product.stock_quantity}</div>
                        </TableCell>
                        <TableCell>
                          {getConditionBadge(product.condition)}
                        </TableCell>
                        <TableCell>
                          {getAvailabilityBadge(product.is_available)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewProduct(product.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditProduct(product.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </ProtectedRoute>
  )
} 