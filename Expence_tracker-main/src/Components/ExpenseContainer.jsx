import React, { useEffect } from 'react'
import { useState } from 'react'
import ExpenseForm from './ExpenseForm.jsx'

import History from './History.jsx'
import BalanceContainer from './BalanceContainer.jsx'
import { Link } from 'react-router-dom'
function ExpenseContainer() {
  const [expense,setExpense]=useState([]);
  const [loading,setLoading]=useState(true);

  //fetch
  const fetchExpenses=async()=>{
    setLoading(true);
    try{
      const response=await fetch('http://localhost:3000/expense');
      const data= await response.json();
      setExpense(data);
    }catch(error){
      console.error('Failed to fetch',error);
    }
    setLoading(false);
  }
  console.log(expense);

  useEffect(()=>{
    fetchExpenses();
  },[]);

  
//  const EXPENSE=[{
//   id:uid(),
//   title:"Expense1",
//   amount:100
//  },{
//   id:uid(),
//   title:"Expense2",
//   amount:500
//  }]



    // const[expense,setExpense]=useState(EXPENSE)
    // function addExpense(title,amount){
    //     setExpense([...expense,{ id:uid(),title,amount}])
    // }
    const addExpense=async(title,amount)=>{
      try{
        const response=await fetch('http://localhost:3000/expense',{
           method:'POST',
           headers:{'Content-Type':'application/json'},
           body:JSON.stringify({title,amount}),
        });
        if(response.ok){
          const newItem=await response.json();
          setExpense((prev)=>[...prev,newItem]);
        }else{
          console.error('Failed to add expense');
        }
      }
      catch(error){
        console.log('Error adding expense',error);
      }
    };

    
  

// function deleteExpense(_id){
// setExpense(expense.filter((exp)=>exp._id!=_id))
// }
const deleteExpense=async(id)=>{
  try{
        const response=await fetch(`http://localhost:3000/expense/${id}`,{
          method:'DELETE',
  });
  if(response.ok){
    setExpense(expense.filter((exp)=>exp._id!==id));
  }else{
    console.error('Failed to delete expense');
  }
 }catch(error){
    console.error('Error in deleting expense',error)
  }
};

const editExpense = async (title, amount, id) => {
  try {
    const response = await fetch(`http://localhost:3000/expense/${id}`, { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, amount }),
    });

    if (response.ok) {
      const newItem = await response.json();
      setExpense((prev) =>
        prev.map((item) =>
          item.id === id ? newItem : item 
        )
        );
    } else {
      console.error('Failed to edit expense');
    }
  } catch (error) {
    console.log('Error edit expense', error);
  }
};


    // console.log(expense)

  return (
    <div className="expense-container">
      <h1>Expense Tracker</h1>
      <BalanceContainer expense={expense} />
      <History expense={expense} deleteExpense={deleteExpense} editExpense={editExpense}/>
      <ExpenseForm addExpense={addExpense} />
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default ExpenseContainer