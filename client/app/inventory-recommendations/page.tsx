"use client";

import Header from "@/app/(components)/Header";
import { useGetInventoryRecommendationsQuery } from "@/state/api";
import { AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";

const urgencyStyles = {
  critical: {
    badge: "bg-red-100 text-red-700 border border-red-300",
    row: "bg-red-50",
    label: "Critical",
  },
  warning: {
    badge: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    row: "bg-yellow-50",
    label: "Warning",
  },
};

const InventoryRecommendations = () => {
  const { data, isLoading, isError } = useGetInventoryRecommendationsQuery();

  if (isLoading) return <div className="py-4">Loading recommendations...</div>;
  if (isError || !data)
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch inventory recommendations
      </div>
    );

  const criticalCount = data.recommendations.filter(
    (r) => r.urgency === "critical",
  ).length;
  const warningCount = data.recommendations.filter(
    (r) => r.urgency === "warning",
  ).length;
  const generatedAt = new Date(data.generatedAt).toLocaleString();

  return (
    <div className="mx-auto pb-5 w-full">
      <div className="mb-6">
        <Header name="Inventory Recommendations" />
        <p className="text-sm text-gray-500 mt-1">
          Based on {data.analysisWindowDays}-day sales history &middot; Generated{" "}
          {generatedAt}
        </p>
      </div>

      {/* SUMMARY BAR */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-xs text-red-500 font-medium">Critical</p>
            <p className="text-xl font-bold text-red-700">{criticalCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
          <TrendingDown className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-xs text-yellow-600 font-medium">Warning</p>
            <p className="text-xl font-bold text-yellow-700">{warningCount}</p>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {data.recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <CheckCircle className="w-12 h-12 mb-3 text-green-400" />
          <p className="text-lg font-medium text-gray-500">All stocked up</p>
          <p className="text-sm">No products are at risk of running out in the next 7 days.</p>
        </div>
      ) : (
        /* TABLE */
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Product",
                  "Urgency",
                  "Current Stock",
                  "Avg Daily Use",
                  "Days Until Stockout",
                  "Recommended Reorder",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.recommendations.map((item) => {
                const style = urgencyStyles[item.urgency];
                return (
                  <tr key={item.productId} className={`${style.row} hover:brightness-95 transition-all`}>
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {item.productName}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${style.badge}`}>
                        {style.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      {item.currentStock} units
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      {item.avgDailyConsumption} units/day
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {item.daysUntilStockout === 0
                        ? "Out of stock"
                        : `${item.daysUntilStockout} day${item.daysUntilStockout === 1 ? "" : "s"}`}
                    </td>
                    <td className="px-5 py-4 text-blue-700 font-semibold">
                      {item.recommendedReorderQty} units
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InventoryRecommendations;
