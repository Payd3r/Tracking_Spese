import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BalanceCard } from "@/components/tracking/BalanceCard";
import { TransactionChart } from "@/components/tracking/TransactionChart";
import { RecentTransactions } from "@/components/tracking/RecentTransactions";
import { QuickActions } from "@/components/tracking/QuickActions";

const Home = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 space-y-6">
      <div className="smooth-enter">
        <BalanceCard />
      </div>
      
      <div className="smooth-enter" style={{ animationDelay: '0.1s' }}>
        <QuickActions />
      </div>

      <div className="smooth-enter" style={{ animationDelay: '0.2s' }}>
        <TransactionChart 
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </div>

      <div className="smooth-enter" style={{ animationDelay: '0.3s' }}>
        <RecentTransactions />
      </div>
    </div>
  );
};

export default Home;