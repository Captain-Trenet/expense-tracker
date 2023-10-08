import { Expense, categoriesData } from "../interfaces/global";

export const setCategories = (cats: [object]) => {
  if (!cats) {
    localStorage.setItem("categories", JSON.stringify(categoriesData));
  }
};

export const groupExpensesByMonth = (
  expenses: Expense[]
): { month: string; expenses: Expense[] }[] => {
  const groupedExpenses: Record<string, Expense[]> = {};

  // Sort expenses by date in descending order
  expenses.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  expenses.forEach((expense) => {
    const year = new Date(expense.date).getFullYear();
    const month = new Date(expense.date).getMonth();

    const monthKey = `${year}-${month}`;

    if (!groupedExpenses[monthKey]) {
      groupedExpenses[monthKey] = [];
    }

    groupedExpenses[monthKey].push(expense);
  });

  const result = Object.keys(groupedExpenses).map((monthKey) => ({
    month: monthKey,
    expenses: groupedExpenses[monthKey],
  }));

  return result;
};

export const calculateNetExpenses = (data: Expense[]): string => {
  let cashInTotal = 0;
  let cashOutTotal = 0;

  data.forEach((expense) => {
    if (expense.type === "Cash In") {
      cashInTotal += expense.amount;
    } else if (expense.type === "Cash Out") {
      cashOutTotal += expense.amount;
    }
  });

  const netExpense = cashInTotal - cashOutTotal;
  return convertNumToStr(netExpense);
};

export const convertDateToFormattedString = (dateString: string): string => {
  const [year, month] = dateString.split("-");
  const formattedDate = `${Number(month) + 1}/${year}`;
  return formattedDate;
};

export const convertNumToStr = (expense: number, type?: string): string => {
  if (type === "Cash Out") {
    return `- ¥${Math.abs(expense)}`;
  }
  if (expense > 0) {
    return `¥${expense}`;
  } else {
    return `- ¥${Math.abs(expense)}`;
  }
};