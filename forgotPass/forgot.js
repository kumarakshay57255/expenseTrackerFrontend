const forgot = document.getElementById('forgot');

forgot.addEventListener('click',forgotPass)


async function forgotPass(e){
     e.preventDefault();
     
     const email = document.getElementById('email').value;
     const token = localStorage.getItem('token');
     const data = await axios.post('http://localhost:4400/password/forgotpassword',{email},{headers:{"Authorization":token}});
      alert(data.data.msg);
}