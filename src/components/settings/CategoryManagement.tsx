import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Tag, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  icon: string;
  type: 'income' | 'expense';
}

interface CategoryManagementProps {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  isMobile: boolean;
}

export const CategoryManagement = ({ categories, onCategoriesChange, isMobile }: CategoryManagementProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📝');
  const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense'>('expense');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      icon: newCategoryIcon,
      type: newCategoryType
    };

    onCategoriesChange([...categories, newCategory]);
    
    toast({
      title: "Categoria aggiunta",
      description: `La categoria "${newCategory.name}" è stata creata`
    });

    setNewCategoryName('');
    setNewCategoryIcon('📝');
    setIsOpen(false);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryIcon(category.icon);
    setNewCategoryType(category.type);
    setIsOpen(true);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !newCategoryName.trim()) return;

    const updatedCategories = categories.map(cat => 
      cat.id === editingCategory.id 
        ? { ...cat, name: newCategoryName.trim(), icon: newCategoryIcon, type: newCategoryType }
        : cat
    );

    onCategoriesChange(updatedCategories);
    
    toast({
      title: "Categoria aggiornata",
      description: `La categoria è stata modificata`
    });

    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryIcon('📝');
    setIsOpen(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    onCategoriesChange(updatedCategories);
    
    toast({
      title: "Categoria eliminata",
      description: "La categoria è stata rimossa",
      variant: "destructive"
    });
  };

  const content = (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-sm font-medium">Categorie Esistenti</Label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-3 glass-button rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg">{category.icon}</span>
                <div>
                  <p className="font-medium text-sm">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.type === 'income' ? 'Entrata' : 'Uscita'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditCategory(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">
          {editingCategory ? 'Modifica Categoria' : 'Nuova Categoria'}
        </Label>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="category-name">Nome</Label>
            <Input
              id="category-name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Es. Shopping"
              className="glass-input"
            />
          </div>

          <div>
            <Label htmlFor="category-icon">Icona</Label>
            <Input
              id="category-icon"
              value={newCategoryIcon}
              onChange={(e) => setNewCategoryIcon(e.target.value)}
              placeholder="📝"
              className="glass-input"
            />
          </div>

          <div>
            <Label>Tipo</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={newCategoryType === 'expense' ? 'default' : 'ghost'}
                onClick={() => setNewCategoryType('expense')}
                className="flex-1"
              >
                Uscita
              </Button>
              <Button
                type="button"
                size="sm"
                variant={newCategoryType === 'income' ? 'default' : 'ghost'}
                onClick={() => setNewCategoryType('income')}
                className="flex-1"
              >
                Entrata
              </Button>
            </div>
          </div>

          <Button 
            onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
            className="w-full"
            disabled={!newCategoryName.trim()}
          >
            {editingCategory ? 'Aggiorna Categoria' : 'Aggiungi Categoria'}
          </Button>
        </div>
      </div>
    </div>
  );

  const Trigger = (
    <Button variant="outline" className="glass-button w-full flex items-center gap-2">
      <Tag className="h-4 w-4" />
      Gestisci Categorie
    </Button>
  );

  if (isMobile) {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">Gestione Categorie</Label>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            {Trigger}
          </DrawerTrigger>
          <DrawerContent className="glass-card border-t">
            <DrawerHeader>
              <DrawerTitle>Gestisci Categorie</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8">
              {content}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Gestione Categorie</Label>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {Trigger}
        </DialogTrigger>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle>Gestisci Categorie</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    </div>
  );
};