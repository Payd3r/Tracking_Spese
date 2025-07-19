import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { transactionTypeIcons, Trash2 } from "@/lib/icons";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

import { Transaction } from "@/lib/api";

interface TransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (transaction: Transaction) => void;
  onDelete?: (id: number) => void;
}

interface TransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

const categories = {
  income: ['Stipendio', 'Freelance', 'Investimenti', 'Regali', 'Altro'],
  expense: ['Spesa', 'Casa', 'Trasporti', 'Ristorante', 'Divertimento', 'Salute', 'Shopping', 'Altro'],
  transfer: ['Trasferimento']
};

const accounts = ['Revolut', 'Contanti', 'Banca', 'PayPal'];

export const TransactionModal = ({ transaction, isOpen, onClose, onSave, onDelete }: TransactionModalProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [editedTransaction, setEditedTransaction] = useState<Transaction | null>(transaction);

  const handleSave = () => {
    if (!editedTransaction) return;
    
    onSave?.(editedTransaction);
    toast({
      title: "Transazione aggiornata",
      description: "Le modifiche sono state salvate con successo",
    });
    onClose();
  };

  const handleDelete = () => {
    if (!transaction) return;
    
    onDelete?.(transaction.id);
    toast({
      title: "Transazione eliminata",
      description: "La transazione è stata rimossa",
      variant: "destructive"
    });
    onClose();
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    const IconComponent = transactionTypeIcons[type];
    return <IconComponent className="h-5 w-5 text-success" />;
  };

  const getTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'income': return 'Entrata';
      case 'expense': return 'Uscita';
    }
  };

  if (!transaction || !editedTransaction) return null;

  const content = (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {getTransactionIcon(transaction.type)}
        <div>
          <h3 className="font-semibold">{getTypeLabel(transaction.type)}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(transaction.date).toLocaleDateString('it-IT')}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Importo</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={Math.abs(editedTransaction.amount)}
              onChange={(e) => setEditedTransaction({
                ...editedTransaction,
                amount: parseFloat(e.target.value) * (transaction.type === 'expense' ? -1 : 1)
              })}
              className="pl-8 glass-input"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrizione</Label>
          <Input
            id="description"
            value={editedTransaction.description}
            onChange={(e) => setEditedTransaction({
              ...editedTransaction,
              description: e.target.value
            })}
            className="glass-input"
          />
        </div>

        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select 
            value={editedTransaction.category} 
            onValueChange={(value) => setEditedTransaction({
              ...editedTransaction,
              category: value
            })}
          >
            <SelectTrigger className="glass-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card">
              {categories[transaction.type].map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Conto</Label>
          <Select 
            value={editedTransaction.account} 
            onValueChange={(value) => setEditedTransaction({
              ...editedTransaction,
              account: value
            })}
          >
            <SelectTrigger className="glass-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card">
              {accounts.map((acc) => (
                <SelectItem key={acc} value={acc}>{acc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={editedTransaction.date}
            onChange={(e) => setEditedTransaction({
              ...editedTransaction,
              date: e.target.value
            })}
            className="glass-input"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={handleSave} className="flex-1">
          Salva Modifiche
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          className="flex-shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="glass-card border-t">
          <DrawerHeader>
            <DrawerTitle>Dettagli Transazione</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card">
        <DialogHeader>
          <DialogTitle>Dettagli Transazione</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};