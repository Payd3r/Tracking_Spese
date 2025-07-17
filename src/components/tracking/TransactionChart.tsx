import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface TransactionChartProps {
  selectedPeriod: 'day' | 'week' | 'month' | 'year';
  onPeriodChange: (period: 'day' | 'week' | 'month' | 'year') => void;
}

const mockData = {
  day: [
    { name: '00:00', value: 2400 },
    { name: '06:00', value: 2350 },
    { name: '12:00', value: 2450 },
    { name: '18:00', value: 2750 },
  ],
  week: [
    { name: 'Lun', value: 2200 },
    { name: 'Mar', value: 2350 },
    { name: 'Mer', value: 2100 },
    { name: 'Gio', value: 2450 },
    { name: 'Ven', value: 2600 },
    { name: 'Sab', value: 2750 },
    { name: 'Dom', value: 2750 },
  ],
  month: [
    { name: 'Sett 1', value: 2000 },
    { name: 'Sett 2', value: 2200 },
    { name: 'Sett 3', value: 2100 },
    { name: 'Sett 4', value: 2750 },
  ],
  year: [
    { name: 'Gen', value: 1800 },
    { name: 'Feb', value: 2000 },
    { name: 'Mar', value: 2200 },
    { name: 'Apr', value: 2100 },
    { name: 'Mag', value: 2300 },
    { name: 'Giu', value: 2500 },
    { name: 'Lug', value: 2400 },
    { name: 'Ago', value: 2600 },
    { name: 'Set', value: 2550 },
    { name: 'Ott', value: 2700 },
    { name: 'Nov', value: 2650 },
    { name: 'Dic', value: 2750 },
  ],
};

export const TransactionChart = ({ selectedPeriod, onPeriodChange }: TransactionChartProps) => {
  const data = mockData[selectedPeriod];

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
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#colorGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};