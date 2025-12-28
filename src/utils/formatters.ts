export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const formatPercent = (value: number) => {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
};
