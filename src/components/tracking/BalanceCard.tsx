import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, Balance } from "@/lib/api";

export const BalanceCard = () => {
  const [showBalance, setShowBalance] = useState(true);
  
  const { data: balance, isLoading, error } = useQuery<Balance>({
    queryKey: ['balance'],
    queryFn: api.getBalance,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="liquid-glass">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded-lg"></div>
            <div className="h-12 bg-muted rounded-xl"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
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
            <p className="text-lg font-medium">Errore nel caricamento del saldo</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentBalance = balance?.current_balance || 0;
  const monthlyChange = balance?.monthly_change || 0;
  const isPositive = monthlyChange >= 0;

  return (
    <Card className="liquid-glass overflow-hidden">
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-3 font-medium">Saldo Totale</p>
            <div className="flex items-center gap-4">
              {showBalance ? (
                <h1 className="text-4xl font-bold balance-gradient leading-tight">
                  €{currentBalance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </h1>
              ) : (
                <h1 className="text-4xl font-bold text-muted-foreground leading-tight">€ • • • •</h1>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBalance(!showBalance)}
                className="h-10 w-10 p-0 liquid-button"
              >
                {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 backdrop-blur-sm">
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-success" />
          ) : (
            <TrendingDown className="h-5 w-5 text-destructive" />
          )}
          <span className={`text-base font-semibold ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? '+' : ''}€{Math.abs(monthlyChange).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-sm text-muted-foreground">questo mese</span>
        </div>
      </CardContent>
    </Card>
  );
};