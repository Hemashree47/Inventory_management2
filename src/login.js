import React from 'react'
import'./login.css'
function login() {
  return (
    <div className='main'>
        <div className='login'>
        <h1 className='title'>Login</h1>
        <input className='name' type='text' placeholder='username' />
        <input className='pass' type='password' placeholder='password' />
        <button>login</button>
      </div>
    </div>
  )
}

export default login