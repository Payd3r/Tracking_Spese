import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const TransactionChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
  const { data: statistics, isLoading, error } = useQuery({
    queryKey: ['statistics', selectedPeriod],
    queryFn: () => api.getStatistics(selectedPeriod),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Transform data for chart
  const chartData = statistics?.map((item, index) => {
    const date = new Date(item.date);
    let name = '';
    
    if (selectedPeriod === 'day') {
      name = date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    } else if (selectedPeriod === 'week') {
      name = `S${Math.ceil(date.getDate() / 7)}`;
    } else if (selectedPeriod === 'month') {
      name = date.toLocaleDateString('it-IT', { month: 'short' });
    } else if (selectedPeriod === 'year') {
      name = date.toLocaleDateString('it-IT', { year: '2-digit' });
    }
    
    return {
      name,
      balance: item.income - item.expenses,
      expenses: item.expenses,
      income: item.income
    };
  }) || [];

  // Check if there are any expenses
  const hasExpenses = chartData.some(item => item.expenses > 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="liquid-glass p-4 rounded-xl border border-white/30 backdrop-blur-xl">
          <p className="font-semibold text-base mb-2">{label}</p>
          <p className="text-primary font-bold">Saldo: €{data.balance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
          {data.expenses > 0 && (
            <p className="text-destructive font-medium">Spese: €{data.expenses.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="liquid-glass">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <CardTitle className="text-xl">Andamento Saldo</CardTitle>
          <div className="flex gap-2 liquid-button rounded-xl p-2 w-full md:w-auto justify-center">
            {(['day', 'week', 'month', 'year'] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className={`h-8 md:h-10 px-2 md:px-4 text-xs md:text-sm flex-1 md:flex-none transition-all duration-300 ${
                  selectedPeriod === period 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'hover:bg-muted/50 hover:shadow-md'
                }`}
              >
                {period === 'day' && <span className="hidden md:inline">Giorno</span>}
                {period === 'day' && <span className="md:hidden">G</span>}
                {period === 'week' && <span className="hidden md:inline">Settimana</span>}
                {period === 'week' && <span className="md:hidden">S</span>}
                {period === 'month' && <span className="hidden md:inline">Mese</span>}
                {period === 'month' && <span className="md:hidden">M</span>}
                {period === 'year' && <span className="hidden md:inline">Anno</span>}
                {period === 'year' && <span className="md:hidden">A</span>}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 p-0">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground text-lg font-medium">Caricamento...</div>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-destructive">
              <div className="text-lg font-medium">Errore nel caricamento dei dati</div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-xl font-semibold mb-3">Nessun dato disponibile</p>
                <p className="text-base">Il grafico apparirà quando aggiungerai delle transazioni</p>
              </div>
            </div>
          ) : hasExpenses ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  className="text-sm text-muted-foreground"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-sm text-muted-foreground"
                  tickFormatter={(value) => `€${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="hsl(var(--primary))"
                  strokeWidth={4}
                  dot={(props: any) => {
                    const { cx, cy, payload, index } = props;
                    return payload.expenses > 0 ? (
                      <circle
                        key={`dot-${index}`}
                        cx={cx}
                        cy={cy}
                        r={8}
                        fill="hsl(var(--primary))"
                        stroke="hsl(var(--background))"
                        strokeWidth={3}
                        className="drop-shadow-xl"
                      />
                    ) : null;
                  }}
                  activeDot={{ r: 10, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-xl font-semibold mb-3">Nessuna spesa registrata</p>
                <p className="text-base">Il grafico apparirà quando aggiungerai delle transazioni</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};