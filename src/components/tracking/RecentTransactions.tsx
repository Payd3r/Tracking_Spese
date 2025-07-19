import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, MoreHorizontal } from "lucide-react";
import { TransactionModal } from "@/components/shared/TransactionModal";

interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  description: string;
  amount: number;
  account: string;
  date: string;
  icon: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    category: 'Ristorante',
    description: 'Cena con amici',
    amount: -45.50,
    account: 'Revolut',
    date: '2024-01-15',
    icon: '🍽️'
  },
  {
    id: '2',
    type: 'income',
    category: 'Stipendio',
    description: 'Stipendio Gennaio',
    amount: 2500.00,
    account: 'Banca',
    date: '2024-01-15',
    icon: '💰'
  },
  {
    id: '3',
    type: 'expense',
    category: 'Trasporti',
    description: 'Benzina',
    amount: -65.00,
    account: 'Contanti',
    date: '2024-01-14',
    icon: '⛽'
  },
  {
    id: '4',
    type: 'transfer',
    category: 'Trasferimento',
    description: 'Da Banca a Revolut',
    amount: 200.00,
    account: 'Revolut',
    date: '2024-01-14',
    icon: '🔄'
  },
  {
    id: '5',
    type: 'expense',
    category: 'Spesa',
    description: 'Supermercato',
    amount: -85.30,
    account: 'Revolut',
    date: '2024-01-13',
    icon: '🛒'
  }
];

export const RecentTransactions = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleTransactionSave = (updatedTransaction: Transaction) => {
    // In una app reale, qui salveresti nel database
    console.log('Transazione aggiornata:', updatedTransaction);
  };

  const handleTransactionDelete = (id: string) => {
    // In una app reale, qui elimineresti dal database
    console.log('Transazione eliminata:', id);
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return <ArrowDownLeft className="h-4 w-4 text-success" />;
      case 'expense':
        return <ArrowUpRight className="h-4 w-4 text-destructive" />;
      case 'transfer':
        return <ArrowRightLeft className="h-4 w-4 text-primary" />;
    }
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

  return (
    <Card className="glass-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Transazioni Recenti</h3>
        <Button variant="ghost" size="sm" className="glass-button">
          Mostra Tutte
        </Button>
      </div>

      <div className="space-y-3">
        {mockTransactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="flex items-center justify-between p-3 rounded-lg glass-button hover:bg-muted/50 transition-all cursor-pointer"
            onClick={() => handleTransactionClick(transaction)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <p className="font-medium text-sm">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {transaction.category} • {transaction.account}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${getAmountColor(transaction.type)}`}>
                {transaction.type === 'expense' ? '' : transaction.type === 'transfer' ? '' : '+'}
                €{Math.abs(transaction.amount).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">{transaction.date}</p>
            </div>
          </div>
        ))}
      </div>

      <TransactionModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleTransactionSave}
        onDelete={handleTransactionDelete}
      />
    </Card>
  );
};