import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { transactionTypeIcons } from "@/lib/icons";
import { TransactionDetailsModal } from "@/components/shared/TransactionDetailsModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Transaction } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export const RecentTransactions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch transactions
  const { data: transactions = [], isLoading, error } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: api.getTransactions,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: ({ id, transaction }: { id: number; transaction: Partial<Transaction> }) =>
      api.updateTransaction(id, transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
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

  const deleteMutation = useMutation({
    mutationFn: api.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      toast({
        title: "Transazione eliminata",
        description: "La transazione è stata rimossa",
        variant: "destructive",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile eliminare la transazione",
        variant: "destructive",
      });
    },
  });

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleTransactionSave = (updatedTransaction: Transaction) => {
    updateMutation.mutate({
      id: updatedTransaction.id,
      transaction: updatedTransaction,
    });
    setIsModalOpen(false);
  };

  const handleTransactionDelete = (id: number) => {
    deleteMutation.mutate(id);
    setIsModalOpen(false);
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    const IconComponent = transactionTypeIcons[type];
    return <IconComponent className="h-5 w-5 text-success" />;
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

  if (isLoading) {
    return (
      <Card className="liquid-glass">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted"></div>
                  <div>
                    <div className="h-4 bg-muted rounded w-28 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-36"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="liquid-glass">
        <CardContent className="p-8">
          <div className="text-center text-destructive">
            <p className="text-lg font-medium">Errore nel caricamento delle transazioni</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="liquid-glass">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Transazioni Recenti</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="liquid-button"
            onClick={() => navigate('/transactions')}
          >
            Tutte
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-4 rounded-xl liquid-button hover:bg-muted/50 transition-all duration-300 cursor-pointer group"
              onClick={() => handleTransactionClick(transaction)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-muted/70 transition-all duration-300">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <p className="font-semibold text-base">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category_name || 'Senza categoria'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${getAmountColor(transaction.type)}`}>
                  {transaction.type === 'expense' ? '' : transaction.type === 'income' ? '+' : ''}
                  €{Math.abs(transaction.amount).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString('it-IT')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium mb-2">Nessuna transazione trovata</p>
            <p className="text-sm">Aggiungi la tua prima transazione!</p>
          </div>
        )}
      </CardContent>

      <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleTransactionSave}
        onDelete={handleTransactionDelete}
      />
    </Card>
  );
};