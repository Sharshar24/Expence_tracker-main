import React, { useEffect, useState } from 'react'
import ExpenseForm from './ExpenseForm.jsx'
import History from './History.jsx'
import BalanceContainer from './BalanceContainer.jsx'
import { v4 as uuidv4 } from 'uuid';

function ExpenseContainer({ user }) {
  const [expense, setExpense] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  // Load expenses from backend
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:4000/expense/${user}`)
        .then(res => res.json())
        .then(data => setExpense(data))
        .catch(err => console.error("Error fetching expenses:", err));
    }
  }, [user]);

  const addExpense = async (title, amount) => {
    try {
      const response = await fetch('http://localhost:4000/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user,
          title,
          amount: Number(amount),
          date: new Date().toISOString()
        })
      });
      if (response.ok) {
        const newExpense = await response.json();
        setExpense((prev) => [...prev, newExpense]);
      }
    } catch (err) {
      console.error("Failed to add expense", err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/expense/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setExpense(expense.filter((exp) => exp._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete expense", err);
    }
  };

  const editExpense = async (title, amount, id) => {
    try {
      const response = await fetch(`http://localhost:4000/expense/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, amount: Number(amount) })
      });
      if (response.ok) {
        setExpense((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, title, amount: Number(amount) } : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to edit expense", err);
    }
  };

  // Group and filter expenses by month
  const monthlyExpenses = expense.filter(exp => exp.date && exp.date.startsWith(selectedMonth));
  
  // Calculate unique months for the sidebar
  const monthsSet = new Set(expense.filter(e => e.date).map(exp => exp.date.slice(0, 7)));
  monthsSet.add(new Date().toISOString().slice(0, 7)); // Always include current month
  const months = [...monthsSet].sort().reverse();

  return (
    <div className="layout-container">
      {/* Sidebar for Month History */}
      <div className="sidebar">
        <h3>Monthly History</h3>
        <ul className="month-list">
          {months.map(month => {
            const mExpenses = expense.filter(e => e.date && e.date.startsWith(month));
            let saved = 0;
            mExpenses.forEach(e => {
              saved += Number(e.amount); // positive for income, negative for expense
            });
            return (
              <li 
                key={month} 
                className={selectedMonth === month ? 'active-month' : ''}
                onClick={() => setSelectedMonth(month)}
              >
                <div className="month-name">{new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                <div className={`month-savings ${saved >= 0 ? 'income' : 'expense'}`}>
                  Savings: ₹{saved}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Expense Area */}
      <div className="expense-container">
        <h2>{new Date(selectedMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })} Tracker</h2>
        <BalanceContainer expense={monthlyExpenses} />
        <History expense={monthlyExpenses} deleteExpense={deleteExpense} editExpense={editExpense}/>
        <ExpenseForm addExpense={addExpense} />
      </div>
    </div>
  );
}

export default ExpenseContainer;