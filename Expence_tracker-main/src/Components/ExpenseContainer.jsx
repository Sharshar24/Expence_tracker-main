import React, { useEffect, useState } from 'react'
import ExpenseForm from './ExpenseForm.jsx'
import History from './History.jsx'
import BalanceContainer from './BalanceContainer.jsx'

function ExpenseContainer({ user }) {
  const [expense, setExpense] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [selectedDay, setSelectedDay] = useState(null); // YYYY-MM-DD

  // Load expenses from backend
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:4000/expense/${user}`)
        .then(res => res.json())
        .then(data => setExpense(data))
        .catch(err => console.error("Error fetching expenses:", err));
    }
  }, [user]);

  const addExpense = async (title, amount, date) => {
    try {
      const response = await fetch('http://localhost:4000/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user,
          title,
          amount: Number(amount),
          date: date || new Date().toISOString().slice(0, 10)
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

  // Group and filter expenses
  const displayedExpenses = expense.filter(exp => 
    exp.date && (selectedDay ? exp.date.startsWith(selectedDay) : exp.date.startsWith(selectedMonth))
  );

  let totalIncome = 0;
  let totalExpense = 0;
  displayedExpenses.forEach(e => {
    if (Number(e.amount) > 0) totalIncome += Number(e.amount);
    else totalExpense += Math.abs(Number(e.amount));
  });
  
  const saved = totalIncome - totalExpense;
  let suggestion = "";
  
  if (displayedExpenses.length === 0) {
    suggestion = "No transactions found. Start tracking!";
  } else if (saved > 0) {
    if (saved > totalIncome * 0.5) {
      suggestion = "Wow! 🌟 You're saving more than 50%. Excellent financial management!";
    } else {
      suggestion = "Great job! 👍 You have a positive balance. Keep saving!";
    }
  } else if (saved === 0) {
    suggestion = "You spent exactly what you earned. Try to save a little next time!";
  } else {
    suggestion = "Warning! ⚠️ Your expenses are higher than your income. Cut down on unnecessary spending!";
  }
  
  // Calculate unique months for the sidebar
  const monthsSet = new Set(expense.filter(e => e.date).map(exp => exp.date.slice(0, 7)));
  monthsSet.add(new Date().toISOString().slice(0, 7)); // Always include current month
  const months = [...monthsSet].sort().reverse();

  // Calculate day-wise summary for the selected month
  const daysInMonth = {};
  displayedExpenses.forEach(exp => {
    if(!selectedDay) { // only compute if viewing a month
      const day = exp.date.slice(0, 10);
      if (!daysInMonth[day]) daysInMonth[day] = { income: 0, expense: 0, savings: 0 };
      const amt = Number(exp.amount);
      if (amt > 0) daysInMonth[day].income += amt;
      else daysInMonth[day].expense += Math.abs(amt);
      daysInMonth[day].savings += amt;
    }
  });

  return (
    <div className="layout-container">
      {/* Left Sidebar for Month History */}
      <div className="sidebar left-sidebar">
        <h3>Monthly History</h3>
        <ul className="month-list">
          {months.map(month => {
            const mExpenses = expense.filter(e => e.date && e.date.startsWith(month));
            let mSaved = 0;
            mExpenses.forEach(e => {
              mSaved += Number(e.amount);
            });
            return (
              <li 
                key={month} 
                className={selectedMonth === month && !selectedDay ? 'active-month' : ''}
                onClick={() => { setSelectedMonth(month); setSelectedDay(null); }}
              >
                <div className="month-name">{new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                <div className={`month-savings ${mSaved >= 0 ? 'income' : 'expense'}`}>
                  Savings: ₹{mSaved}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Expense Area */}
      <div className="expense-container center-panel">
        <div className="header-actions">
           <h2>{selectedDay ? new Date(selectedDay).toDateString() : new Date(selectedMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })} Tracker</h2>
           <div className="day-picker">
              <label>Pick a Day: </label>
              <input type="date" value={selectedDay || ""} onChange={(e) => setSelectedDay(e.target.value)} />
              {selectedDay && <button className="clear-btn" onClick={() => setSelectedDay(null)}>Clear</button>}
           </div>
        </div>
        
        <div className={`suggestion-box ${saved >= 0 ? 'positive' : 'negative'}`}>
            {suggestion}
        </div>

        <BalanceContainer expense={displayedExpenses} />
        
        <ExpenseForm addExpense={addExpense} />
      </div>

      {/* Right Sidebar for Day-wise / Transaction History */}
      <div className="sidebar right-sidebar">
        {selectedDay ? (
           <>
             <h3>History for {new Date(selectedDay).toDateString()}</h3>
             <History expense={displayedExpenses} deleteExpense={deleteExpense} editExpense={editExpense}/>
           </>
        ) : (
           <>
             <h3>Day-wise Summary</h3>
             <ul className="month-list">
               {Object.keys(daysInMonth).length === 0 && <p style={{textAlign: 'center', marginTop: '20px'}}>No records</p>}
               {Object.keys(daysInMonth).sort().reverse().map(day => (
                 <li key={day} onClick={() => setSelectedDay(day)} style={{display: 'flex', flexDirection: 'column'}}>
                   <div className="month-name">{new Date(day).toDateString()}</div>
                   <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px'}}>
                      <span style={{fontSize: '13px', color: '#059669', fontWeight: '700'}}>In: ₹{daysInMonth[day].income}</span>
                      <span style={{fontSize: '13px', color: '#e11d48', fontWeight: '700'}}>Out: ₹{daysInMonth[day].expense}</span>
                   </div>
                   <div style={{fontSize: '14px', fontWeight: '700', marginTop: '5px', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '5px'}}>
                      Net: <span className={daysInMonth[day].savings >= 0 ? 'income' : 'expense'}>₹{daysInMonth[day].savings}</span>
                   </div>
                 </li>
               ))}
             </ul>
           </>
        )}
      </div>
    </div>
  );
}

export default ExpenseContainer;