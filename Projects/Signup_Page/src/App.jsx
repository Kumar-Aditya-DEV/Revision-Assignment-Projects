// import React, { useState, useRef } from 'react';

// function App() {

//   const[formData, setForm] = useState({
//     name1: "",
//     email1: "",
//     mobile: "",
//   });

//   function handleForm(event){

//     event.preventDefault();
//     // console.log(event.target);
//     console.log("User pressed one character that's why Igot called");

//     setForm({...formData, [event.target.name]: event.target.value});

//     console.log(formData); 
    
//   }

//   function storeFormData(){
//     event.preventDefault();
//     console.log("Now the entire form data is going to store in localStorage");
//     localStorage.setItem("userData", JSON.stringify(formData) );
//     console.log("Data stored..... ");

//     event.target.form.reset();
    
//   }

// return (
// <>
// <form>
// <input type="text" name="name1" placeholder='Enter your name' value={formData.name1} onChange={handleForm} required />
// <input type="email" name="email" placeholder='Enter your email' value={formData.email1} onChange={handleForm} required />
// <input type="text" name="mobile" placeholder='Enter your mobile number' value={formData.mobile} onChange={handleForm} required />
// <button type="button" onClick={storeFormData}>Submit</button>
// </form>
// </>
// );

// }

// export default App;







                                       //with the help of use ref  
import React, { useRef } from 'react';

function App() {

  const name1Ref = useRef();
  const emailRef = useRef();
  const mobileRef = useRef();
  const paraRef = useRef();

  function storeFormData(event){

    event.preventDefault();

    console.log("Now the entire form data is going to store in localStorage");

    const obj1 = {
      name1 : name1Ref.current.value,
      email: emailRef.current.value,
      mobile: mobileRef.current.value,
    };

    console.log(obj1);

    localStorage.setItem("userData", JSON.stringify(obj1));

    console.log("Data stored.....");

    event.target.reset();   // ✅ Proper reset
  }

  return (
    <>
      <form onSubmit={storeFormData}>
        <input type="text" ref={name1Ref} name="name1" placeholder='Enter your name' required />
        <input type="email" ref={emailRef} name="email" placeholder='Enter your email' required />
        <input type="text" ref={mobileRef} name="mobile" placeholder='Enter your mobile number' required />
        <button type="submit">Submit</button>
      </form>
      <p ref={paraRef}>Hellow </p>
    </>
  );
}

export default App;
