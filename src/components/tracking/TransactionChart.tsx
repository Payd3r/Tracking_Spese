import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, Tooltip, CartesianGrid } from 'recharts';

interface TransactionChartProps {
  selectedPeriod: 'day' | 'week' | 'month' | 'year';
  onPeriodChange: (period: 'day' | 'week' | 'month' | 'year') => void;
}

const mockData = {
  day: [
    { name: '00:00', balance: 2400, expenses: 0 },
    { name: '06:00', balance: 2350, expenses: 50 },
    { name: '12:00', balance: 2450, expenses: 0 },
    { name: '18:00', balance: 2750, expenses: 120 },
  ],
  week: [
    { name: 'Lun', balance: 2200, expenses: 85 },
    { name: 'Mar', balance: 2350, expenses: 65 },
    { name: 'Mer', balance: 2100, expenses: 95 },
    { name: 'Gio', balance: 2450, expenses: 45 },
    { name: 'Ven', balance: 2600, expenses: 120 },
    { name: 'Sab', balance: 2750, expenses: 200 },
    { name: 'Dom', balance: 2750, expenses: 30 },
  ],
  month: [
    { name: 'Sett 1', balance: 2000, expenses: 450 },
    { name: 'Sett 2', balance: 2200, expenses: 380 },
    { name: 'Sett 3', balance: 2100, expenses: 520 },
    { name: 'Sett 4', balance: 2750, expenses: 280 },
  ],
  year: [
    { name: 'Gen', balance: 1800, expenses: 1200 },
    { name: 'Feb', balance: 2000, expenses: 980 },
    { name: 'Mar', balance: 2200, expenses: 1150 },
    { name: 'Apr', balance: 2100, expenses: 1080 },
    { name: 'Mag', balance: 2300, expenses: 1250 },
    { name: 'Giu', balance: 2500, expenses: 1380 },
    { name: 'Lug', balance: 2400, expenses: 1420 },
    { name: 'Ago', balance: 2600, expenses: 1320 },
    { name: 'Set', balance: 2550, expenses: 1180 },
    { name: 'Ott', balance: 2700, expenses: 1350 },
    { name: 'Nov', balance: 2650, expenses: 1220 },
    { name: 'Dic', balance: 2750, expenses: 1480 },
  ],
};

export const TransactionChart = ({ selectedPeriod, onPeriodChange }: TransactionChartProps) => {
  const data = mockData[selectedPeriod];
  
  // Filtra solo i punti con spese > 0 per mostrare i punti
  const hasExpenses = data.some(item => item.expenses > 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 border border-white/20 backdrop-blur-md">
          <p className="font-medium">{label}</p>
          <p className="text-primary">Saldo: €{data.balance}</p>
          {data.expenses > 0 && (
            <p className="text-destructive">Spese: €{data.expenses}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Andamento Saldo</h3>
        <div className="flex gap-1 glass-button rounded-lg p-1">
          {(['day', 'week', 'month', 'year'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "ghost"}
              size="sm"
              onClick={() => onPeriodChange(period)}
              className={`h-8 px-3 text-xs ${
                selectedPeriod === period 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              {period === 'day' && 'Giorno'}
              {period === 'week' && 'Settimana'}
              {period === 'month' && 'Mese'}
              {period === 'year' && 'Anno'}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-64">
        {hasExpenses ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
                className="text-xs text-muted-foreground"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  return payload.expenses > 0 ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill="hsl(var(--primary))"
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                      className="drop-shadow-lg"
                    />
                  ) : null;
                }}
                activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">Nessuna spesa registrata</p>
              <p className="text-sm">Il grafico apparirà quando aggiungerai delle transazioni</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};