import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();

  const handleQuickAction = (type: 'income' | 'expense' | 'transfer') => {
    navigate('/add', { state: { preSelectedType: type } });
  };

  return (
    <Card className="liquid-glass">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Azioni Rapide</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <Button 
            variant="ghost" 
            className="h-20 md:h-20 flex-col gap-2 md:gap-3 liquid-button border border-success/30 md:hover:bg-success/10 md:hover:border-success/50 active:bg-success/20 transition-all duration-300 touch-manipulation"
            onClick={() => handleQuickAction('income')}
          >
            <div className="p-3 md:p-2 rounded-full bg-success/20 border border-success/30">
              <ArrowDownLeft className="h-6 w-6 md:h-6 md:w-6 text-success-foreground" />
            </div>
            <span className="text-xs md:text-sm font-semibold text-success-foreground hidden md:block">Entrata</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="h-20 md:h-20 flex-col gap-2 md:gap-3 liquid-button border border-warning/30 md:hover:bg-warning/10 md:hover:border-warning/50 active:bg-warning/20 transition-all duration-300 touch-manipulation"
            onClick={() => handleQuickAction('expense')}
          >
            <div className="p-3 md:p-2 rounded-full bg-warning/20 border border-warning/30">
              <ArrowUpRight className="h-6 w-6 md:h-6 md:w-6 text-warning-foreground" />
            </div>
            <span className="text-xs md:text-sm font-semibold text-warning-foreground hidden md:block">Uscita</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="h-20 md:h-20 flex-col gap-2 md:gap-3 liquid-button border border-primary/30 md:hover:bg-primary/10 md:hover:border-primary/50 active:bg-primary/20 transition-all duration-300 touch-manipulation"
            onClick={() => handleQuickAction('transfer')}
          >
            <div className="p-3 md:p-2 rounded-full bg-primary/20 border border-primary/30">
              <ArrowRightLeft className="h-6 w-6 md:h-6 md:w-6 text-primary-foreground" />
            </div>
            <span className="text-xs md:text-sm font-semibold text-primary-foreground hidden md:block">Trasferimento</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};