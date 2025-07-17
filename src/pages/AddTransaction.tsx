import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TransactionType = 'income' | 'expense' | 'transfer';

const categories = {
  income: ['Stipendio', 'Freelance', 'Investimenti', 'Regali', 'Altro'],
  expense: ['Spesa', 'Casa', 'Trasporti', 'Ristorante', 'Divertimento', 'Salute', 'Shopping', 'Altro'],
  transfer: ['Trasferimento']
};

const accounts = ['Revolut', 'Contanti', 'Banca', 'PayPal'];

const AddTransaction = () => {
  const { toast } = useToast();
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category || !account) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive"
      });
      return;
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
            <Label htmlFor="description">Descrizione *</Label>
            <Input
              id="description"
              type="text"
              placeholder="Es. Spesa al supermercato"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass-input"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Categoria *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Seleziona categoria" />
              </SelectTrigger>
              <SelectContent className="glass-card">
                {categories[transactionType].map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Account */}
          <div className="space-y-2">
            <Label>Conto *</Label>
            <Select value={account} onValueChange={setAccount} required>
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Seleziona conto" />
              </SelectTrigger>
              <SelectContent className="glass-card">
                {accounts.map((acc) => (
                  <SelectItem key={acc} value={acc}>{acc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
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