import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Category } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { 
  getIcon, 
  transactionTypeIcons, 
  accountIcons, 
  actionIcons,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Calculator
} from "@/lib/icons";

type TransactionType = 'income' | 'expense' | 'transfer';

// Account predefiniti
const accounts = [
  { name: 'Revolut', icon: accountIcons.Revolut },
  { name: 'Contanti', icon: accountIcons.Contanti },
  { name: 'Banca', icon: accountIcons.Banca },
  { name: 'PayPal', icon: accountIcons.PayPal }
];

const AddTransaction = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [account, setAccount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Handle pre-selected type from navigation
  useEffect(() => {
    const preSelectedType = location.state?.preSelectedType;
    if (preSelectedType && ['income', 'expense', 'transfer'].includes(preSelectedType)) {
      setTransactionType(preSelectedType as TransactionType);
    }
  }, [location.state]);

  // Fetch categories from API
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  // Create transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: api.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      toast({
        title: "Transazione aggiunta!",
        description: "La transazione è stata registrata con successo",
        duration: 3000, // Toast scompare dopo 3 secondi
      });
      // Reset form
      setAmount('');
      setDescription('');
      setCategoryId(null);
      setAccount('');
      // Reindirizza alla home dopo 1 secondo
      setTimeout(() => {
        navigate('/');
      }, 1000);
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile aggiungere la transazione",
        variant: "destructive",
        duration: 5000, // Toast di errore rimane più a lungo
      });
    },
  });

  const getDateShortcut = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (transactionType === 'transfer') {
      if (!amount || !fromAccount || !toAccount) {
        toast({
          title: "Errore",
          description: "Compila tutti i campi obbligatori per il trasferimento",
          variant: "destructive"
        });
        return;
      }
    } else {
      if (!amount || !categoryId || !account) {
        toast({
          title: "Errore",
          description: "Compila tutti i campi obbligatori",
          variant: "destructive"
        });
        return;
      }
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Errore",
        description: "Inserisci un importo valido",
        variant: "destructive"
      });
      return;
    }

    if (transactionType === 'transfer' && fromAccount === toAccount) {
      toast({
        title: "Errore",
        description: "I conti di partenza e arrivo devono essere diversi",
        variant: "destructive"
      });
      return;
    }

    createTransactionMutation.mutate({
      description: transactionType === 'transfer' ? `Trasferimento da ${fromAccount} a ${toAccount}` : (description || 'Transazione'),
      amount: amountValue,
      type: transactionType,
      category_id: transactionType === 'transfer' ? null : categoryId,
      date: date,
      notes: transactionType === 'transfer' ? `${fromAccount} → ${toAccount}` : account
    });
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
                inputMode="decimal"
                pattern="[0-9]*"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 glass-input"
                required
              />
            </div>
          </div>

          {/* Description - Only for income/expense */}
          {transactionType !== 'transfer' && (
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
          )}

          {/* Category - Only for income/expense */}
          {transactionType !== 'transfer' && (
            <div className="space-y-3">
              <Label>Categoria *</Label>
              {categoriesLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : (
                              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {categories.map((cat) => {
                  const IconComponent = getIcon(cat.icon);
                  return (
                    <Button
                      key={cat.id}
                      type="button"
                      variant={categoryId === cat.id ? "default" : "ghost"}
                      onClick={() => setCategoryId(cat.id)}
                      className={`h-12 md:h-16 flex-col gap-1 md:gap-2 glass-button ${
                        categoryId === cat.id 
                          ? 'bg-primary text-primary-foreground shadow-lg' 
                          : 'hover:bg-muted/30 hover:shadow-md'
                      }`}
                    >
                      <IconComponent className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-xs font-medium">{cat.name}</span>
                    </Button>
                  );
                })}
              </div>
              )}
            </div>
          )}

          {/* Account Selection - Different for transfer vs income/expense */}
          {transactionType === 'transfer' ? (
            <>
              {/* From Account */}
              <div className="space-y-3">
                <Label>Conto di Partenza *</Label>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  {accounts.map((acc) => {
                    const IconComponent = acc.icon;
                    return (
                      <Button
                        key={acc.name}
                        type="button"
                        variant={fromAccount === acc.name ? "default" : "ghost"}
                        onClick={() => setFromAccount(acc.name)}
                        className={`h-12 md:h-16 flex-col gap-1 md:gap-2 glass-button ${
                          fromAccount === acc.name 
                            ? 'bg-primary text-primary-foreground shadow-lg' 
                            : 'hover:bg-muted/30 hover:shadow-md'
                        }`}
                      >
                        <IconComponent className="h-4 w-4 md:h-5 md:w-5" />
                        <span className="text-xs font-medium">{acc.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* To Account */}
              <div className="space-y-3">
                <Label>Conto di Arrivo *</Label>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  {accounts.map((acc) => {
                    const IconComponent = acc.icon;
                    return (
                      <Button
                        key={acc.name}
                        type="button"
                        variant={toAccount === acc.name ? "default" : "ghost"}
                        onClick={() => setToAccount(acc.name)}
                        className={`h-12 md:h-16 flex-col gap-1 md:gap-2 glass-button ${
                          toAccount === acc.name 
                            ? 'bg-primary text-primary-foreground shadow-lg' 
                            : 'hover:bg-muted/30 hover:shadow-md'
                        }`}
                      >
                        <IconComponent className="h-4 w-4 md:h-5 md:w-5" />
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
                          <div className="grid grid-cols-2 gap-2 md:gap-3">
              {accounts.map((acc) => {
                const IconComponent = acc.icon;
                return (
                  <Button
                    key={acc.name}
                    type="button"
                    variant={account === acc.name ? "default" : "ghost"}
                    onClick={() => setAccount(acc.name)}
                    className={`h-12 md:h-16 flex-col gap-1 md:gap-2 glass-button ${
                      account === acc.name 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'hover:bg-muted/30 hover:shadow-md'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 md:h-5 md:w-5" />
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
                variant={date === getDateShortcut(0) ? "default" : "ghost"}
                size="sm"
                onClick={() => setDate(getDateShortcut(0))}
                className={`glass-button text-xs ${
                  date === getDateShortcut(0) 
                    ? 'bg-primary text-primary-foreground' 
                    : ''
                }`}
              >
                Oggi
              </Button>
              <Button
                type="button"
                variant={date === getDateShortcut(1) ? "default" : "ghost"}
                size="sm"
                onClick={() => setDate(getDateShortcut(1))}
                className={`glass-button text-xs ${
                  date === getDateShortcut(1) 
                    ? 'bg-primary text-primary-foreground' 
                    : ''
                }`}
              >
                Ieri
              </Button>
              <Button
                type="button"
                variant={date === getDateShortcut(2) ? "default" : "ghost"}
                size="sm"
                onClick={() => setDate(getDateShortcut(2))}
                className={`glass-button text-xs ${
                  date === getDateShortcut(2) 
                    ? 'bg-primary text-primary-foreground' 
                    : ''
                }`}
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