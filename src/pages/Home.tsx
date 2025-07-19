import { BalanceCard } from "@/components/tracking/BalanceCard";
import { QuickActions } from "@/components/tracking/QuickActions";
import { RecentTransactions } from "@/components/tracking/RecentTransactions";
import { TransactionChart } from "@/components/tracking/TransactionChart";

export const Home = () => {
  return (
    <div className="min-h-screen pb-24 px-4 pt-6 space-y-6">
      {/* Balance and Quick Actions - Side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceCard />
        <QuickActions />
      </div>
      
      {/* Chart and Transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TransactionChart />
        <RecentTransactions />
      </div>
    </div>
  );
};

export default Home;