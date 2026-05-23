import React, { useState } from 'react'
import '../index.css'
function ExpenseForm(props) {
    const [title,setTitle]=useState("")
    const[amount,setAmount]=useState("")

   function  handleTitleChange(e){
       setTitle(e.target.value)
       
    }
    function handleAmountChange(e){
        setAmount(e.target.value)
    }

    function handleSubmit(e){
          e.preventDefault();
          props.addExpense(title,amount)
          setTitle("")
          setAmount("")
    }
  return (
    <>
    <div className='expense-form'>
    <h3>Add Expense/Income</h3>
    <form onSubmit={handleSubmit}>
       <div className='form-group'>
        <label className='form-label'>Title: </label>
        <input 
        id='title' 
        type="text"
        value={title}
        onChange={handleTitleChange}
        className='form-input'/>
       </div>
     <div className='form-group'>
        <label className='form-label'>Amount </label>
        <input 
        id='amount' 
        type="number"
        value={amount}
        onChange={handleAmountChange}
        className='form-input'/>
       </div>

       <button type='submit'>Add Expense/Income</button>
    </form>
    </div>
    
    </>
  )
}

export default ExpenseForm