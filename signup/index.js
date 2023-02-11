const signUp = document.getElementById('signUp');


signUp.addEventListener('click',addUser)

async function addUser(event){
   try {
     
       event.preventDefault();
       const name = document.getElementById('name').value;
       const email = document.getElementById('email').value;
       const pass = document.getElementById('pass').value;
       const obj = {
         name,email,password:pass
       }
     const userPost = await axios.post('http://localhost:4400/signUp',obj)
     alert(userPost.data);
   } catch (error) {
     throw Error(error);
   }
}