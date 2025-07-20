import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { transactionTypeIcons } from "@/lib/icons";
import { TransactionDetailsModal } from "@/components/shared/TransactionDetailsModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Transaction, Category } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Filter, Search, ChevronDown, ChevronUp, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile, useScrollToTop } from "@/hooks/use-mobile";

export const Transactions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  useScrollToTop(); // Aggiungo lo scroll to top
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all' as 'all' | 'income' | 'expense',
    category: 'all',
    account: 'all'
  });

  // Fetch transactions
  const { data: transactions = [], isLoading, error } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: api.getTransactions,
    refetchInterval: 30000,
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: api.getCategories,
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

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      account: 'all'
    });
  };

  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.category !== 'all' || filters.account !== 'all';

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = filters.type === 'all' || transaction.type === filters.type;
    const matchesCategory = filters.category === 'all' || transaction.category_id.toString() === filters.category;
    const matchesAccount = filters.account === 'all' || transaction.notes === filters.account;
    
    return matchesSearch && matchesType && matchesCategory && matchesAccount;
  });

  const getTransactionIcon = (type: Transaction['type']) => {
    const IconComponent = transactionTypeIcons[type];
    return <IconComponent className="h-4 w-4 text-success" />;
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

  // Get unique accounts
  const accounts = [...new Set(transactions.map(t => t.notes))].filter(Boolean);

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24 px-4 pt-6">
        <Card className="liquid-glass p-6">
          <div className="animate-pulse space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted"></div>
                  <div>
                    <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-32"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-muted rounded w-16 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pb-24 px-4 pt-6">
        <Card className="liquid-glass p-6">
          <div className="text-center text-destructive">
            <p>Errore nel caricamento delle transazioni</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-content px-4 pt-6">
      <Card className="liquid-glass p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="p-2 liquid-button"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Tutte le Transazioni</h1>
        </div>

        {/* Modern Filters Section */}
        <div className="mb-6">
          {/* Filter Toggle Button - Mobile */}
          {isMobile && (
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full liquid-button mb-4 flex items-center justify-between border-border/50 bg-background/80 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtri</span>
                {hasActiveFilters && (
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                )}
              </div>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}

          {/* Filters Content */}
          <div className={`${isMobile ? (showFilters ? 'block animate-slide-down' : 'hidden') : 'block'}`}>
            <div className="liquid-glass p-4 rounded-xl space-y-4 border border-border/30 bg-background/60 backdrop-blur-md">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca transazioni..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 liquid-input bg-background/80 border-border/50 focus:border-primary/50"
                />
              </div>
              
              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value as any }))}>
                  <SelectTrigger className="liquid-input bg-background/80 border-border/50 focus:border-primary/50">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent className="liquid-glass border-border/50 bg-background/95 backdrop-blur-md">
                    <SelectItem value="all">Tutti i tipi</SelectItem>
                    <SelectItem value="income">Entrate</SelectItem>
                    <SelectItem value="expense">Uscite</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="liquid-input bg-background/80 border-border/50 focus:border-primary/50">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="liquid-glass border-border/50 bg-background/95 backdrop-blur-md">
                    <SelectItem value="all">Tutte le categorie</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filters.account} onValueChange={(value) => setFilters(prev => ({ ...prev, account: value }))}>
                  <SelectTrigger className="liquid-input bg-background/80 border-border/50 focus:border-primary/50">
                    <SelectValue placeholder="Conto" />
                  </SelectTrigger>
                  <SelectContent className="liquid-glass border-border/50 bg-background/95 backdrop-blur-md">
                    <SelectItem value="all">Tutti i conti</SelectItem>
                    {accounts.map(account => (
                      <SelectItem key={account} value={account}>
                        {account}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="liquid-button text-muted-foreground hover:text-foreground bg-background/50 hover:bg-background/80"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancella filtri
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nessuna transazione trovata</p>
              <p className="text-sm">Prova a modificare i filtri</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
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
                      {transaction.category_name || 'Senza categoria'} • {transaction.notes}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getAmountColor(transaction.type)}`}>
                    {transaction.type === 'expense' ? '' : transaction.type === 'income' ? '+' : ''}
                    €{Math.abs(transaction.amount).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('it-IT')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <TransactionDetailsModal
          transaction={selectedTransaction}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleTransactionSave}
          onDelete={handleTransactionDelete}
        />
      </Card>
    </div>
  );
};

export default Transactions; 