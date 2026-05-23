import React from 'react'
import '../index.css'
import CurrentItem from './CurrentItem'
function BalanceContainer(props) {
const{expense}=props

let expenses=0;
let income=0;

expense.forEach((Item)=>{
    let{amount}=Item;
   if(amount>0){
    income+= parseInt(amount);
   }
   else{
    expenses+=parseInt(amount);
   }
})
  return (
    <>
  <div className='balance-container'>
<CurrentItem title="income"  amount={income} type="income"/>
<CurrentItem  title="expense"   amount={expenses} type="expense"/>
<CurrentItem  title="balance"  amount={income+expenses} type="balance"/></div>
    </>
  )
}

export default BalanceContainer