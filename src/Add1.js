import React, { useState } from "react";
import './Add1.css';
 
function Add() {
        const [modal, setModal] = useState(false);
      
        const toggleModal = () => {
          setModal(!modal);
        };
        const submitButton=()=>{
            console.log("submited")
        }
      
        if(modal) {
          document.body.classList.add('active-modal')
        } else {
          document.body.classList.remove('active-modal')
        }
    return (  
        <div className='main'>
        <button onClick={toggleModal} className="btn-modal">
        +Add component
      </button>
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h3 className="component1">Component Name :</h3> 
            <h3 className="component2"> Quantity :</h3>
          <input className="data1" type='text' placeholder='Component Name' />   
          <input className="num" type='number' placeholder=' Quantity' />          
             <button className="sub" onClick={submitButton} >submit</button>
            <button className="close-modal" onClick={toggleModal}>
              Close
            </button>
          </div>
        </div>

      )}
    </div>
  )
}

export default Add
