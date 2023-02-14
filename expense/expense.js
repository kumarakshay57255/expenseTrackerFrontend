

let expense = document.getElementById('expense')
let description = document.getElementById('description')
let category = document.getElementById('options')
let addExpense = document.getElementById('addExpence')
let btn = document.getElementById('submit');


btn.addEventListener('click',AddExpense);
addExpense.addEventListener('click',deleteExpense);

async function AddExpense(event){

    try {
      event.preventDefault();
    
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
     const item = await axios.post('http://localhost:4400/expense',obj);
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
   const  items  = await axios.get('http://localhost:4400/expense');
    items.data.expense.map((ele)=>{
      showItems(ele);
    });
    
  } catch (error) {
    throw Error(error);
  }
   
})

async function deleteExpense(event){
   if(event.target.classList.contains('delete')){
     const id = event.target.parentElement.id;
     const expense = await axios.delete(`http://localhost:4400/expense/${id}`);
     alert(expense.data.message)
   addExpense.removeChild(event.target.parentElement);
   
  }

 
}