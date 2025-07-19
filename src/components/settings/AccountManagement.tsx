import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { CreditCard, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Account {
  id: string;
  name: string;
  icon: string;
}

interface AccountManagementProps {
  accounts: Account[];
  onAccountsChange: (accounts: Account[]) => void;
  isMobile: boolean;
}

export const AccountManagement = ({ accounts, onAccountsChange, isMobile }: AccountManagementProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountIcon, setNewAccountIcon] = useState('💳');

  const handleAddAccount = () => {
    if (!newAccountName.trim()) return;

    const newAccount: Account = {
      id: Date.now().toString(),
      name: newAccountName.trim(),
      icon: newAccountIcon
    };

    onAccountsChange([...accounts, newAccount]);
    
    toast({
      title: "Conto aggiunto",
      description: `Il conto "${newAccount.name}" è stato creato`
    });

    setNewAccountName('');
    setNewAccountIcon('💳');
    setIsOpen(false);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setNewAccountName(account.name);
    setNewAccountIcon(account.icon);
    setIsOpen(true);
  };

  const handleUpdateAccount = () => {
    if (!editingAccount || !newAccountName.trim()) return;

    const updatedAccounts = accounts.map(acc => 
      acc.id === editingAccount.id 
        ? { ...acc, name: newAccountName.trim(), icon: newAccountIcon }
        : acc
    );

    onAccountsChange(updatedAccounts);
    
    toast({
      title: "Conto aggiornato",
      description: `Il conto è stato modificato`
    });

    setEditingAccount(null);
    setNewAccountName('');
    setNewAccountIcon('💳');
    setIsOpen(false);
  };

  const handleDeleteAccount = (accountId: string) => {
    const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
    onAccountsChange(updatedAccounts);
    
    toast({
      title: "Conto eliminato",
      description: "Il conto è stato rimosso",
      variant: "destructive"
    });
  };

  const content = (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-sm font-medium">Conti Esistenti</Label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-3 glass-button rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg">{account.icon}</span>
                <p className="font-medium text-sm">{account.name}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditAccount(account)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteAccount(account.id)}
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
          {editingAccount ? 'Modifica Conto' : 'Nuovo Conto'}
        </Label>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="account-name">Nome</Label>
            <Input
              id="account-name"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              placeholder="Es. Revolut"
              className="glass-input"
            />
          </div>

          <div>
            <Label htmlFor="account-icon">Icona</Label>
            <Input
              id="account-icon"
              value={newAccountIcon}
              onChange={(e) => setNewAccountIcon(e.target.value)}
              placeholder="💳"
              className="glass-input"
            />
          </div>

          <Button 
            onClick={editingAccount ? handleUpdateAccount : handleAddAccount}
            className="w-full"
            disabled={!newAccountName.trim()}
          >
            {editingAccount ? 'Aggiorna Conto' : 'Aggiungi Conto'}
          </Button>
        </div>
      </div>
    </div>
  );

  const Trigger = (
    <Button variant="outline" className="glass-button w-full flex items-center gap-2">
      <CreditCard className="h-4 w-4" />
      Gestisci Conti
    </Button>
  );

  if (isMobile) {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">Gestione Conti</Label>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            {Trigger}
          </DrawerTrigger>
          <DrawerContent className="glass-card border-t">
            <DrawerHeader>
              <DrawerTitle>Gestisci Conti</DrawerTitle>
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
      <Label className="text-sm font-medium">Gestione Conti</Label>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {Trigger}
        </DialogTrigger>
        <DialogContent className="glass-card max-w-md">
          <DialogHeader>
            <DialogTitle>Gestisci Conti</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    </div>
  );
};