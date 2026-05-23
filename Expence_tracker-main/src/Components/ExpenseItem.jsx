import React from 'react'

function ExpenseItem(props) {
    const {amount,title,_id}=props.expense
    const type = amount >0 ? "income":"expense"
    function handleDelete(){
      props.deleteExpense(_id)
    }
 
  function handleEdit(){
      const newTitle = prompt("Enter new title", title);
      const newAmount = prompt("Enter new amount", amount);
      if(newTitle && newAmount) {
          props.editExpense(newTitle, newAmount, _id);
      }
  }

  return (
    <>
    <div className={`expense-item ${type}`}>
<div className='expense-title'>{title}</div>

<div className='expense-amount'>{amount}</div>
<div className='delete-button-overlay'>
 <button onClick={handleEdit}>Edit</button>
  <button onClick={handleDelete}>Delete</button>
</div>

    </div>
    </>
  )
}

export default ExpenseItem