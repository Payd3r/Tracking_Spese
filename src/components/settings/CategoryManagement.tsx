import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Category } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { categoryIcons, getIcon } from "@/lib/icons";

export const CategoryManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'other' });
  const [selectedIcon, setSelectedIcon] = useState('other');

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsAddDialogOpen(false);
      setNewCategory({ name: '', icon: 'other' });
      toast({
        title: "Categoria creata",
        description: "La categoria è stata aggiunta con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile creare la categoria",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, category }: { id: number; category: Partial<Category> }) =>
      api.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null);
      toast({
        title: "Categoria aggiornata",
        description: "Le modifiche sono state salvate con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare la categoria",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Categoria eliminata",
        description: "La categoria è stata rimossa",
        variant: "destructive",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile eliminare la categoria",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    if (newCategory.name.trim()) {
      createMutation.mutate({
        name: newCategory.name.trim(),
        icon: newCategory.icon,
      });
    }
  };

  const handleUpdate = () => {
    if (editingCategory && editingCategory.name.trim()) {
      updateMutation.mutate({
        id: editingCategory.id,
        category: {
          name: editingCategory.name.trim(),
          icon: editingCategory.icon,
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory({ ...category });
    setSelectedIcon(category.icon);
  };

  const IconSelector = ({ value, onChange }: { value: string; onChange: (icon: string) => void }) => (
    <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
      {Object.entries(categoryIcons).map(([iconName, IconComponent]) => (
        <button
          key={iconName}
          onClick={() => onChange(iconName)}
          className={`p-3 rounded-lg transition-all duration-200 flex items-center justify-center ${
            value === iconName
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'bg-muted/50 hover:bg-muted hover:shadow-md'
          }`}
        >
          <IconComponent className="h-5 w-5" />
        </button>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <Card className="liquid-glass">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted"></div>
                  <div className="h-4 bg-muted rounded w-32"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded bg-muted"></div>
                  <div className="w-8 h-8 rounded bg-muted"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="liquid-glass">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Gestione Categorie</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="liquid-button">
              <Plus className="h-4 w-4 mr-2" />
              Nuova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="liquid-glass">
            <DialogHeader>
              <DialogTitle>Aggiungi Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nome</label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome categoria"
                  className="liquid-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Icona</label>
                <IconSelector
                  value={newCategory.icon}
                  onChange={(icon) => setNewCategory(prev => ({ ...prev, icon }))}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreate} className="flex-1 liquid-button">
                  Aggiungi
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="liquid-button"
                >
                  Annulla
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categories.map((category) => {
            const IconComponent = getIcon(category.icon);
            return (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 rounded-xl liquid-button hover:bg-muted/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(category)}
                        className="liquid-button"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="liquid-glass">
                      <DialogHeader>
                        <DialogTitle>Modifica Categoria</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Nome</label>
                          <Input
                            value={editingCategory?.name || ''}
                            onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                            placeholder="Nome categoria"
                            className="liquid-input"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Icona</label>
                          <IconSelector
                            value={selectedIcon}
                            onChange={setSelectedIcon}
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={() => {
                              if (editingCategory) {
                                setEditingCategory(prev => prev ? { ...prev, icon: selectedIcon } : null);
                                handleUpdate();
                              }
                            }}
                            className="flex-1 liquid-button"
                          >
                            Salva
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingCategory(null)}
                            className="liquid-button"
                          >
                            Annulla
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="liquid-button text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          
          {categories.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium mb-2">Nessuna categoria trovata</p>
              <p className="text-sm">Crea la tua prima categoria!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};