const signUp = document.getElementById('signUp');
const names = document.getElementById('name');
const email = document.getElementById('email');
const pass = document.getElementById('pass')
signUp.addEventListener('click',()=>{
   if(names.value==''){
    alert('Name cannot be empty');
    return;
   }
   if(email.value==''){
    alert('email cannot be empty');
    return;
   }
   if(pass.value==''){
    alert('password cannot be empty');
    return;
   }
})