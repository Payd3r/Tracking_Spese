import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const BalanceCard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const currentBalance = 2750.45;
  const monthlyChange = 350.20;
  const isPositive = monthlyChange >= 0;

  return (
    <Card className="glass-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Saldo Totale</p>
          <div className="flex items-center gap-3">
            {showBalance ? (
              <h1 className="text-3xl font-bold balance-gradient">
                €{currentBalance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
              </h1>
            ) : (
              <h1 className="text-3xl font-bold text-muted-foreground">€ • • • •</h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="h-8 w-8 p-0 glass-button"
            >
              {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-success" />
        ) : (
          <TrendingDown className="h-4 w-4 text-destructive" />
        )}
        <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? '+' : ''}€{Math.abs(monthlyChange).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
        </span>
        <span className="text-sm text-muted-foreground">questo mese</span>
      </div>
    </Card>
  );
};