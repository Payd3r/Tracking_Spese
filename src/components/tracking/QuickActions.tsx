import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from "lucide-react";

export const QuickActions = () => {
  return (
    <Card className="glass-card p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Azioni Rapide</h3>
      <div className="grid grid-cols-3 gap-3">
        <Button 
          variant="ghost" 
          className="h-16 flex-col gap-2 glass-button category-income border border-success/20 hover:bg-success/10"
        >
          <ArrowDownLeft className="h-5 w-5 text-success" />
          <span className="text-xs font-medium">Entrata</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="h-16 flex-col gap-2 glass-button category-expense border border-warning/20 hover:bg-warning/10"
        >
          <ArrowUpRight className="h-5 w-5 text-warning" />
          <span className="text-xs font-medium">Uscita</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="h-16 flex-col gap-2 glass-button category-transfer border border-primary/20 hover:bg-primary/10"
        >
          <ArrowRightLeft className="h-5 w-5 text-primary" />
          <span className="text-xs font-medium">Trasferimento</span>
        </Button>
      </div>
    </Card>
  );
};