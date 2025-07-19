import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Transaction, Category } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  getIcon, 
  transactionTypeIcons, 
  accountIcons,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Edit,
  Trash2,
  X
} from "@/lib/icons";

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

export const TransactionDetailsModal = ({
  transaction,
  isOpen,
  onClose,
  onSave,
  onDelete
}: TransactionDetailsModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Transaction>>({});

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, transaction }: { id: number; transaction: Partial<Transaction> }) =>
      api.updateTransaction(id, transaction),
    onSuccess: (updatedTransaction) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      onSave(updatedTransaction);
      setIsEditing(false);
      toast({
        title: "Transazione aggiornata",
        description: "Le modifiche sono state salvate con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare la transazione",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    if (transaction) {
      setEditData({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category_id: transaction.category_id,
        date: transaction.date,
        notes: transaction.notes
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (transaction && editData) {
      updateMutation.mutate({
        id: transaction.id,
        transaction: editData
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleDelete = () => {
    if (transaction) {
      onDelete(transaction.id);
    }
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    const IconComponent = transactionTypeIcons[type];
    return <IconComponent className="h-6 w-6" />;
  };

  const getAmountColor = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'text-success';
      case 'expense':
        return 'text-destructive';
      case 'transfer':
        return 'text-primary';
    }
  };

  const getTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'Entrata';
      case 'expense':
        return 'Uscita';
      case 'transfer':
        return 'Trasferimento';
    }
  };

  if (!transaction) return null;

  const content = (
    <div className="space-y-6">
      {isEditing ? (
        // Edit Form
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Descrizione</Label>
            <Input
              value={editData.description || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label>Importo</Label>
            <Input
              type="number"
              step="0.01"
              value={editData.amount || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select 
              value={editData.category_id?.toString() || ''} 
              onValueChange={(value) => setEditData(prev => ({ ...prev, category_id: parseInt(value) }))}
            >
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Seleziona categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    <div className="flex items-center gap-2">
                      {getIcon(cat.icon) && (() => {
                       const IconComponent = getIcon(cat.icon);
                       return <IconComponent className="h-4 w-4" />;
                     })()}
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Input
              type="date"
              value={editData.date || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, date: e.target.value }))}
              className="glass-input"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Annulla
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Salva
            </Button>
          </div>
        </div>
      ) : (
        // View Details
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <h3 className="font-semibold">{transaction.description}</h3>
                <p className="text-sm text-muted-foreground">{getTypeLabel(transaction.type)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xl font-bold ${getAmountColor(transaction.type)}`}>
                {transaction.type === 'expense' ? '' : '+'}
                €{Math.abs(transaction.amount).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Categoria:</span>
              <span className="font-medium">{transaction.category_name || 'Senza categoria'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Conto:</span>
              <span className="font-medium">{transaction.notes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data:</span>
              <span className="font-medium">
                {new Date(transaction.date).toLocaleDateString('it-IT')}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleEdit} className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Modifica
            </Button>
            <Button variant="outline" onClick={handleDelete} className="flex-1 text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Elimina
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Dettagli Transazione</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {content}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Dettagli Transazione</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}; 