let expense = document.getElementById('expense')
let description = document.getElementById('description')
let category = document.getElementById('options')
let addExpense = document.getElementById('addExpence')
let btn = document.getElementById('submit');
let razor = document.getElementById('razorpay')

razor.addEventListener('click',buyPremium);
btn.addEventListener('click',AddExpense);
addExpense.addEventListener('click',deleteExpense);

async function AddExpense(event){

    try {
      event.preventDefault();
      const token = localStorage.getItem('token');
    
    if(expense.value==''||description.value==''||category.value==''){
      alert('plz enter all values');
       expense.value='';
       description.value='';
       category.value='';
    }
    else if(expense.value<=0){
      alert('plz enter positive value for expense');
      expense.value='';
    }
    else{
      let obj={
          expenseamount:expense.value,description:description.value,category:category.value
      }
     const item = await axios.post('http://localhost:4400/expense',obj,{headers:{"Authorization":token}});
     showItems(item.data.expense);
 
  
  }
    } catch (error) {
       throw Error(error);
    }

} 

function showItems(obj){

  let li = document.createElement('li');
   li.id=`${obj.id}`;

   let delBtn = document.createElement('button');
   delBtn.className="btn btn-danger delete";
  delBtn.appendChild(document.createTextNode('Delete Expense'))
   let editBtn = document.createElement('button');
   editBtn.className = "btn btn-info edit";
    editBtn.appendChild(document.createTextNode('Edit Expense'));

    li.appendChild(document.createTextNode(`${obj.expenseamount} ${obj.category} ${obj.description}`))
    li.appendChild(delBtn);
    li.appendChild(editBtn);
    addExpense.appendChild(li);

}

window.addEventListener('DOMContentLoaded',async(e)=>{
  try {
    const token = localStorage.getItem('token');
   const  items  = await axios.get('http://localhost:4400/expense',{headers:{"Authorization":token}});

    items.data.expense.map((ele)=>{
      showItems(ele);
    });
    
  } catch (error) {
    throw Error(error);
  }
   
})

async function deleteExpense(event){
  try {
    if(event.target.classList.contains('delete')){
      const token = localStorage.getItem('token');
      const id = event.target.parentElement.id;
      const expense = await axios.delete(`http://localhost:4400/expense/${id}`,{headers:{"Authorization":token}});
      alert(expense.data.message)
    addExpense.removeChild(event.target.parentElement);
  }}catch (error) {
     throw Error(error);
  }
  
   
  }

  async function buyPremium(e){
    try {
        e.preventDefault();
      const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:4400/purchase/premiummembership',{headers:{"Authorization":token}});
  console.log(response.razorpay_payment_id)
  let options = {
    "key":response.data.key_id,
    "order_id":response.data.order,
    "handler":async function (){
      await axios.post('http://localhost:4400/purchase/updatetransactionstatus',{
        order_id:options.order_id,
        payment_id:response.razorpay_payment_id,
      },{headers:{"Authorization":token}})
      alert('You  are premium user now!')
    },
  
  }
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
  rzp1.on('payment.failed', function (response){
    console.log(response)
    alert('Something went wrong')
 });
      

    } catch (error) {
       throw Error(error);
    }
}

 
