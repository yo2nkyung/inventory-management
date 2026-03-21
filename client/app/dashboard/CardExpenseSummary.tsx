import React from "react";
import { ExpenseByCategorySummary, useGetDashboardDataQuery } from "@/state/api";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { it } from "node:test";
import { TrendingUp } from "lucide-react";

type ExpenseSums = {
  [category: string]: number;
}

const colors = ["#00C49F", "#FFBB28", "#0088FE"];

const CardExpenseSummary = () => {
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useGetDashboardDataQuery();

  const expenseSummary = dashboardData?.expenseSummary[0];
  const expenseByCategorySummary = dashboardData?.expenseByCategorySummary || [];
  const expenseSums = expenseByCategorySummary.reduce((acc: ExpenseSums, item: ExpenseByCategorySummary) => {
    const category = item.category+"Expenses";
    const amount = parseInt(item.amount, 10);
    if (!acc[category]) acc[category] = 0;
    acc[category] += amount;
    return acc;
  },
  {});

  const expenseCategories = Object.entries(expenseSums).map(([name, value]) => ({name, value}));
  const totalExpenses = expenseCategories.reduce(
    (acc, category: {value : number}) => acc + category.value,
    0
  );

  const formattedTotalExpenses = totalExpenses.toFixed(2);

  if (isError) {
    return <div className="m-5">Failed to fetch data</div>;
  }  

  return (
    <div className="flex flex-col justify-between row-span-3 bg-white shadow-md rounded-2xl">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
              Expense Summary
            </h3>
            <hr />
          </div>

          {/* BODY */}
          <div className="xl:flex justify-between pr-7">
            {/* CHART */}
            <div className="relative basis-3/5">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={expenseCategories} innerRadius={50} outerRadius={60} dataKey="value" nameKey="name" fill="#8884d8" cx="50%" cy="50%">
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center basis-2/5">
                  <span className="font-bold text-xl">
                    ${formattedTotalExpenses}
                  </span>
                </div>
              </ResponsiveContainer>
            </div>

            {/* LEGEND */}
            <ul className="flex flex-col justify-around items-center xl:items-start py-5 gap-3">
              {expenseCategories.map((entry, index) => (
                <li key={`legend-${index}`} className="flex items-center text-xs">
                  <span className="mr-2 w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></span>
                  {entry.name}
                </li>
              ))}
            </ul>
          </div>
          {/* FOOTER */}
          <div>
            <hr />
            {expenseSummary && (
              <div className="mt-3 flex justify-between items-center px-7 mb-4">
                <div className="pt-2">
                  <p className="text-sm">
                    Average:{" "}
                    <span className="font-semibold">
                      ${expenseSummary.totalExpenses.toFixed(2)}
                    </span>
                  </p>
                </div>
                <span className="flex items-center mt-2">
                  <TrendingUp className="mr-2 text-green-500" />
                  30%
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CardExpenseSummary;
