import React from 'react'
import WeMoLogo from './pics/WemoLogo.png';

function LoginMain() {
    return (
        <div style= {{ border : '2px solid black', height: '65vh', width: '91.5%', margin: '0vh 5vh 0vh 5vh', borderTopColor:'white', borderRadius:'0px 0px 5px 5px'}}>
        <img src ={WeMoLogo} alt = "WeMoLogo" style= {{ display:'block', margin: '0 auto', paddingTop: '50px'}}/>            
        <div style ={{textAlign:'center', marginTop:'50px'}}>
        <form>
            <label>아이디&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <input type='text'/><br/>
            <label>비밀번호&nbsp;</label>
            <input type='password'/><br/>
        </form>
        </div>
        </div>
    )
}

export default LoginMain
