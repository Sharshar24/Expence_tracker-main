import React, { useState } from 'react'
import '../index.css'

function ExpenseForm(props) {
    const [title, setTitle] = useState("")
    const [amount, setAmount] = useState("")
    const [type, setType] = useState("expense") // "expense" or "income"
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10)) // YYYY-MM-DD

    function handleSubmit(e) {
        e.preventDefault();
        if(!title || !amount || !date) return;
        
        let finalAmount = Number(amount);
        if (type === "expense") {
            finalAmount = -Math.abs(finalAmount); // ensure it's negative
        } else {
            finalAmount = Math.abs(finalAmount); // ensure it's positive
        }

        props.addExpense(title, finalAmount, date)
        setTitle("")
        setAmount("")
    }

  return (
    <div className='expense-form'>
      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit}>
         <div className='form-group-row'>
           <label className={`radio-btn ${type === 'expense' ? 'active-expense' : ''}`}>
             <input type="radio" value="expense" checked={type === "expense"} onChange={() => setType("expense")} />
             Expense
           </label>
           <label className={`radio-btn ${type === 'income' ? 'active-income' : ''}`}>
             <input type="radio" value="income" checked={type === "income"} onChange={() => setType("income")} />
             Income / Savings
           </label>
         </div>
         <div className='form-group'>
          <label className='form-label'>Title: </label>
          <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="e.g., Groceries" />
         </div>
         <div className='form-group'>
          <label className='form-label'>Amount: </label>
          <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Enter amount" />
         </div>
         <div className='form-group'>
          <label className='form-label'>Date: </label>
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
         </div>
         <button type='submit'>Add Transaction</button>
      </form>
    </div>
  )
}

export default ExpenseForm