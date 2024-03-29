let expense = document.getElementById('expense')
let description = document.getElementById('description')
let category = document.getElementById('options')
let addExpense = document.getElementById('addExpence')
let btn = document.getElementById('submit');
let razor = document.getElementById('razorpay')
let leader = document.getElementById('leader');
let board = document.getElementById('board');
const download = document.getElementById('downloadexpense');
const pages = document.getElementById('page');

razor.addEventListener('click',buyPremium);
btn.addEventListener('click',AddExpense);
addExpense.addEventListener('click',deleteExpense);
download.addEventListener('click',downloadExpense);


async function downloadExpense(){
  try {
    const token = localStorage.getItem('token');
 const res = await axios.get('http://localhost:4400/download',{headers:{"Authorization":token}});
 if(res.status===200){
    
    let a = document.createElement("a");
    a.href = res.data.fileURL;
    a.download = 'myexpense.csv';
    a.click();
  }

  else{
    throw new Error(res.data.message);
  }
  } catch (error) {
    alert(error.response.data.message);
  }
  
}


 function showLeaderBoard(){
   try {
     const inputEle = document.createElement("input");
     inputEle.type = "button";
     inputEle.value = "Show Leaderboard";
     inputEle.className = "btn btn-primary"
     inputEle.onclick = async ()=>{
         const token = localStorage.getItem('token');
         const userLeader = await axios.get('http://localhost:4400/premium/showleader',{headers:{"Authorization":token}});
       
         let LeaderboardElem = document.getElementById('board');
         LeaderboardElem.innerHTML = `<h1> Leader Board </h1>`;
         userLeader.data.map((ele)=>{
            LeaderboardElem.innerHTML += `<li> Name - ${ele.name} Total Expense - ${ele.totalexpense}`
         })
  
        }
        document.getElementById("message").appendChild(inputEle);

   
     
       



   } catch (error) {
     throw Error(error);
   }
}



function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

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


    li.appendChild(document.createTextNode(`${obj.expenseamount} ${obj.category} ${obj.description}`))
    li.appendChild(delBtn);

    addExpense.appendChild(li);

}

window.addEventListener('DOMContentLoaded',async(e)=>{
  try {
    const page =1;
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);
    if(decodeToken.ispremiumuser){
      razor.style.visibility = 'hidden';
      document.getElementById('message').innerHTML = 'You are premium user now!';
      showLeaderBoard();
    }
   const  items  = await axios.get(`http://localhost:4400/expense?page=${page}`,{headers:{"Authorization":token}});
    items.data.expense.map((ele)=>{
      showItems(ele);
    });
    showPagination(items.data);
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
    
    const res = await axios.get('http://localhost:4400/purchase/premiummembership',{headers:{"Authorization":token}});
     
  let options = {
    "key":res.data.key_id,
    "order_id":res.data.order.id,
    "handler":async function (response){
      await axios.post('http://localhost:4400/purchase/updatetransactionstatus',{
        order_id:options.order_id,
        payment_id: response.razorpay_payment_id,
      },{headers:{"Authorization":token}})
      alert('You  are premium user now!')
      razor.style.visibility = 'hidden';
    document.getElementById('message').innerHTML = 'You are premium user now!';
      localStorage.setItem('token',res.data.token);
      showLeaderBoard();
    },
  
  }
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();


  rzp1.on('payment.failed', function (response){
   
    alert('Something went wrong')
 });

 } catch (error) {
       throw Error(error);
    }
}

 function showPagination({
  currentPage,
     hashNextPage,
     hashPreviousPage,
     nextPage,
     previousPage,
    

 }){
  pages.innerHTML = '';
  if(hashPreviousPage){
    const btn3 = document.createElement('button');
    btn3.innerHTML = previousPage;
    btn3.addEventListener('click',()=>getItems(previousPage))
    pages.appendChild(btn3);
 }
   const btn1 = document.createElement('button');
   btn1.innerHTML = `<h3>${currentPage}</h3>`;
   btn1.addEventListener('click',()=>getItems(currentPage));
   pages.appendChild(btn1);

 
   if(hashNextPage){
    const btn2 = document.createElement('button');
    btn2.innerHTML = nextPage;
    btn2.addEventListener('click',()=>getItems(nextPage))
    pages.appendChild(btn2);
 }
   
    
 }

async function getItems(page){
  const token = localStorage.getItem('token')
 
  const item =  await axios.get(`http://localhost:4400/expense?page=${page}`,{headers:{"Authorization":token}});

  addExpense.innerHTML = '';
 item.data.expense.map((ele)=>showItems(ele))

 showPagination(item.data);

}
