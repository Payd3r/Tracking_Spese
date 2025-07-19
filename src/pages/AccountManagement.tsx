import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ArrowLeft, Plus, Edit, Trash2, CreditCard } from "lucide-react";

interface Account {
  id: number;
  name: string;
  icon: string;
  balance: number;
}

export const AccountManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [newAccountName, setNewAccountName] = useState('');
  const [editAccountName, setEditAccountName] = useState('');

  // Mock accounts - in a real app these would come from the API
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 1, name: 'Revolut', icon: 'credit-card', balance: 1250.50 },
    { id: 2, name: 'Contanti', icon: 'credit-card', balance: 85.20 },
    { id: 3, name: 'Banca', icon: 'credit-card', balance: 3450.75 },
    { id: 4, name: 'PayPal', icon: 'credit-card', balance: 320.00 },
  ]);

  const handleAddAccount = () => {
    if (!newAccountName.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci un nome per il conto",
        variant: "destructive"
      });
      return;
    }

    const newAccount: Account = {
      id: Date.now(),
      name: newAccountName.trim(),
      icon: 'credit-card',
      balance: 0
    };

    setAccounts(prev => [...prev, newAccount]);
    setNewAccountName('');
    setIsAddDialogOpen(false);
    
    toast({
      title: "Conto aggiunto",
      description: "Il conto è stato creato con successo",
    });
  };

  const handleEditAccount = () => {
    if (!editingAccount || !editAccountName.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci un nome per il conto",
        variant: "destructive"
      });
      return;
    }

    setAccounts(prev => prev.map(acc => 
      acc.id === editingAccount.id 
        ? { ...acc, name: editAccountName.trim() }
        : acc
    ));
    
    setEditingAccount(null);
    setEditAccountName('');
    setIsEditDialogOpen(false);
    
    toast({
      title: "Conto aggiornato",
      description: "Il conto è stato modificato con successo",
    });
  };

  const handleDeleteAccount = (accountId: number) => {
    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    
    toast({
      title: "Conto eliminato",
      description: "Il conto è stato rimosso",
      variant: "destructive"
    });
  };

  const openEditDialog = (account: Account) => {
    setEditingAccount(account);
    setEditAccountName(account.name);
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
          <h1 className="text-2xl font-bold">Gestione Conti</h1>
        </div>

        <div className="space-y-4">
          {/* Add Account Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Nuovo Conto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Aggiungi Nuovo Conto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="accountName">Nome Conto</Label>
                  <Input
                    id="accountName"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    placeholder="Es. Conto Corrente"
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annulla
                  </Button>
                  <Button onClick={handleAddAccount}>
                    Aggiungi
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Accounts List */}
          <div className="space-y-3">
            {accounts.map((account) => (
              <div 
                key={account.id}
                className="flex items-center justify-between p-4 rounded-lg glass-button"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Saldo: €{account.balance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(account)}
                    className="p-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAccount(account.id)}
                    className="p-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {accounts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nessun conto configurato</p>
              <p className="text-sm">Aggiungi il tuo primo conto!</p>
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifica Conto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editAccountName">Nome Conto</Label>
                <Input
                  id="editAccountName"
                  value={editAccountName}
                  onChange={(e) => setEditAccountName(e.target.value)}
                  placeholder="Es. Conto Corrente"
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annulla
                </Button>
                <Button onClick={handleEditAccount}>
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

export default AccountManagement; 