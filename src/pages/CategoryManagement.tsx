import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api, Category as ApiCategory } from "@/lib/api";
import { ArrowLeft, Plus, Edit, Trash2, Tags } from "lucide-react";
import { getIcon } from "@/lib/icons";

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

const availableIcons = [
  'shopping-cart', 'utensils', 'car', 'home', 'heart', 'graduation-cap',
  'briefcase', 'gamepad-2', 'plane', 'train', 'bus', 'bike',
  'coffee', 'pizza', 'beer', 'wine', 'gift', 'credit-card'
];

const availableColors = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
];

export const CategoryManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('shopping-cart');
  const [newCategoryColor, setNewCategoryColor] = useState('bg-red-500');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryIcon, setEditCategoryIcon] = useState('shopping-cart');
  const [editCategoryColor, setEditCategoryColor] = useState('bg-red-500');

  // Fetch categories from API
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  // Mutations
  const createCategoryMutation = useMutation({
    mutationFn: (category: Omit<ApiCategory, 'id' | 'created_at' | 'updated_at'>) =>
      api.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCategoryName('');
      setNewCategoryIcon('shopping-cart');
      setNewCategoryColor('bg-red-500');
      setIsAddDialogOpen(false);
      toast({
        title: "Categoria aggiunta",
        description: "La categoria è stata creata con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile creare la categoria",
        variant: "destructive"
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, category }: { id: number; category: Partial<ApiCategory> }) =>
      api.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null);
      setEditCategoryName('');
      setEditCategoryIcon('shopping-cart');
      setEditCategoryColor('bg-red-500');
      setIsEditDialogOpen(false);
      toast({
        title: "Categoria aggiornata",
        description: "La categoria è stata modificata con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare la categoria",
        variant: "destructive"
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Categoria eliminata",
        description: "La categoria è stata rimossa",
        variant: "destructive"
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile eliminare la categoria",
        variant: "destructive"
      });
    },
  });

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci un nome per la categoria",
        variant: "destructive"
      });
      return;
    }

    createCategoryMutation.mutate({
      name: newCategoryName.trim(),
      icon: newCategoryIcon,
      color: newCategoryColor
    });
  };

  const handleEditCategory = () => {
    if (!editingCategory || !editCategoryName.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci un nome per la categoria",
        variant: "destructive"
      });
      return;
    }

    updateCategoryMutation.mutate({
      id: editingCategory.id,
      category: {
        name: editCategoryName.trim(),
        icon: editCategoryIcon,
        color: editCategoryColor
      }
    });
  };

  const handleDeleteCategory = (categoryId: number) => {
    deleteCategoryMutation.mutate(categoryId);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setEditCategoryIcon(category.icon);
    setEditCategoryColor(category.color);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <Card className="glass-card p-6 smooth-enter">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Gestione Categorie</h1>
        </div>

        <div className="space-y-4">
          {/* Add Category Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Nuova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Aggiungi Nuova Categoria</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Nome Categoria</Label>
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Es. Spesa"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Icona</Label>
                  <Select value={newCategoryIcon} onValueChange={setNewCategoryIcon}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableIcons.map(icon => (
                        <SelectItem key={icon} value={icon}>
                                                  <div className="flex items-center gap-2">
                          {getIcon(icon) && (() => {
                            const IconComponent = getIcon(icon);
                            return <IconComponent className="h-4 w-4" />;
                          })()}
                          {icon}
                        </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Colore</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full ${color} ${
                          newCategoryColor === color ? 'ring-2 ring-primary ring-offset-2' : ''
                        }`}
                        onClick={() => setNewCategoryColor(color)}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annulla
                  </Button>
                  <Button onClick={handleAddCategory}>
                    Aggiungi
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Categories List */}
          <div className="space-y-3">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="flex items-center justify-between p-4 rounded-lg glass-button"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center`}>
                    {getIcon(category.icon) && (() => {
                      const IconComponent = getIcon(category.icon);
                      return <IconComponent className="h-5 w-5 text-white" />;
                    })()}
                  </div>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Icona: {category.icon}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(category)}
                    className="p-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nessuna categoria configurata</p>
              <p className="text-sm">Aggiungi la tua prima categoria!</p>
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifica Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editCategoryName">Nome Categoria</Label>
                <Input
                  id="editCategoryName"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  placeholder="Es. Spesa"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Icona</Label>
                <Select value={editCategoryIcon} onValueChange={setEditCategoryIcon}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIcons.map(icon => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center gap-2">
                          {getIcon(icon) && (() => {
                            const IconComponent = getIcon(icon);
                            return <IconComponent className="h-4 w-4" />;
                          })()}
                          {icon}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Colore</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full ${color} ${
                        editCategoryColor === color ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      onClick={() => setEditCategoryColor(color)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annulla
                </Button>
                <Button onClick={handleEditCategory}>
                  Salva
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default CategoryManagement; 