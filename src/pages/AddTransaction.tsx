import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Calculator, ShoppingCart, Home, Car, UtensilsCrossed, Gamepad2, Heart, ShoppingBag, DollarSign, Gift, TrendingUp, Banknote, CreditCard, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TransactionType = 'income' | 'expense' | 'transfer';

const categories = {
  income: [
    { name: 'Stipendio', icon: DollarSign },
    { name: 'Freelance', icon: TrendingUp },
    { name: 'Investimenti', icon: TrendingUp },
    { name: 'Regali', icon: Gift },
    { name: 'Altro', icon: DollarSign }
  ],
  expense: [
    { name: 'Spesa', icon: ShoppingCart },
    { name: 'Casa', icon: Home },
    { name: 'Trasporti', icon: Car },
    { name: 'Ristorante', icon: UtensilsCrossed },
    { name: 'Divertimento', icon: Gamepad2 },
    { name: 'Salute', icon: Heart },
    { name: 'Shopping', icon: ShoppingBag },
    { name: 'Altro', icon: ShoppingCart }
  ],
  transfer: []
};

const accounts = [
  { name: 'Revolut', icon: CreditCard },
  { name: 'Contanti', icon: Banknote },
  { name: 'Banca', icon: CreditCard },
  { name: 'PayPal', icon: Wallet }
];

const AddTransaction = () => {
  const { toast } = useToast();
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const getDateShortcut = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazioni diverse per trasferimenti
    if (transactionType === 'transfer') {
      if (!amount || !fromAccount || !toAccount) {
        toast({
          title: "Errore",
          description: "Compila tutti i campi obbligatori",
          variant: "destructive"
        });
        return;
      }
    } else {
      if (!amount || !category || !account) {
        toast({
          title: "Errore",
          description: "Compila tutti i campi obbligatori",
          variant: "destructive"
        });
        return;
      }
    }

    toast({
      title: "Transazione aggiunta!",
      description: `${transactionType === 'income' ? 'Entrata' : transactionType === 'expense' ? 'Uscita' : 'Trasferimento'} di €${amount} registrata`,
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setAccount('');
    setFromAccount('');
    setToAccount('');
  };

  const TypeButton = ({ type, icon, label, color }: { 
    type: TransactionType; 
    icon: React.ReactNode; 
    label: string;
    color: string;
  }) => (
    <Button
      type="button"
      variant={transactionType === type ? "default" : "ghost"}
      onClick={() => setTransactionType(type)}
      className={`flex-1 h-16 flex-col gap-2 glass-button ${
        transactionType === type 
          ? `bg-${color} text-${color}-foreground` 
          : `border border-${color}/20 hover:bg-${color}/10`
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <Card className="glass-card p-6 smooth-enter">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Nuova Transazione</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tipo di Transazione</Label>
            <div className="grid grid-cols-3 gap-3">
              <TypeButton
                type="income"
                icon={<ArrowDownLeft className="h-5 w-5" />}
                label="Entrata"
                color="success"
              />
              <TypeButton
                type="expense"
                icon={<ArrowUpRight className="h-5 w-5" />}
                label="Uscita"
                color="warning"
              />
              <TypeButton
                type="transfer"
                icon={<ArrowRightLeft className="h-5 w-5" />}
                label="Trasferimento"
                color="primary"
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Importo *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 glass-input"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrizione</Label>
            <Input
              id="description"
              type="text"
              placeholder="Es. Spesa al supermercato"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass-input"
            />
          </div>

          {/* Category - Solo se non è trasferimento */}
          {transactionType !== 'transfer' && (
            <div className="space-y-3">
              <Label>Categoria *</Label>
              <div className="grid grid-cols-2 gap-3">
                {categories[transactionType].map((cat) => {
                  const IconComponent = cat.icon;
                  return (
                    <Button
                      key={cat.name}
                      type="button"
                      variant={category === cat.name ? "default" : "ghost"}
                      onClick={() => setCategory(cat.name)}
                      className={`h-16 flex-col gap-2 glass-button ${
                        category === cat.name 
                          ? 'bg-primary text-primary-foreground' 
                          : 'border border-border/20 hover:bg-muted/50'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="text-xs font-medium">{cat.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Account - Diverso per trasferimenti */}
          {transactionType === 'transfer' ? (
            <>
              <div className="space-y-3">
                <Label>Da Conto *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {accounts.map((acc) => {
                    const IconComponent = acc.icon;
                    return (
                      <Button
                        key={acc.name}
                        type="button"
                        variant={fromAccount === acc.name ? "default" : "ghost"}
                        onClick={() => setFromAccount(acc.name)}
                        className={`h-16 flex-col gap-2 glass-button ${
                          fromAccount === acc.name 
                            ? 'bg-primary text-primary-foreground' 
                            : 'border border-border/20 hover:bg-muted/50'
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span className="text-xs font-medium">{acc.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-3">
                <Label>A Conto *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {accounts.map((acc) => {
                    const IconComponent = acc.icon;
                    return (
                      <Button
                        key={acc.name}
                        type="button"
                        variant={toAccount === acc.name ? "default" : "ghost"}
                        onClick={() => setToAccount(acc.name)}
                        className={`h-16 flex-col gap-2 glass-button ${
                          toAccount === acc.name 
                            ? 'bg-primary text-primary-foreground' 
                            : 'border border-border/20 hover:bg-muted/50'
                        }`}
                        disabled={acc.name === fromAccount}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span className="text-xs font-medium">{acc.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <Label>Conto *</Label>
              <div className="grid grid-cols-2 gap-3">
                {accounts.map((acc) => {
                  const IconComponent = acc.icon;
                  return (
                    <Button
                      key={acc.name}
                      type="button"
                      variant={account === acc.name ? "default" : "ghost"}
                      onClick={() => setAccount(acc.name)}
                      className={`h-16 flex-col gap-2 glass-button ${
                        account === acc.name 
                          ? 'bg-primary text-primary-foreground' 
                          : 'border border-border/20 hover:bg-muted/50'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="text-xs font-medium">{acc.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Date with shortcuts */}
          <div className="space-y-3">
            <Label htmlFor="date">Data</Label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDate(getDateShortcut(0))}
                className="glass-button text-xs"
              >
                Oggi
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDate(getDateShortcut(1))}
                className="glass-button text-xs"
              >
                Ieri
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDate(getDateShortcut(2))}
                className="glass-button text-xs"
              >
                2 giorni fa
              </Button>
            </div>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="glass-input"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Aggiungi Transazione
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddTransaction;