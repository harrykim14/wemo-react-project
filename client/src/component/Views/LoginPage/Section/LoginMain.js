import React, { useState, useEffect } from 'react'
import { TextField , Button } from "@material-ui/core";
import WeMoLogo200 from '../../../../Images/WemoLogo_200px.png'
import WeMoLogo400 from '../../../../Images/WemoLogo_400px.png'

function LoginMain() {

    const [logo, setLogo] = useState(WeMoLogo400);
    useEffect(() => {
        (window.innerWidth > 480) ? setLogo(WeMoLogo400) : setLogo(WeMoLogo200);
    }, [])

    return (
        <div style= {{ border : '2px solid black', height: '70vh', margin: '0vh 5vh 0vh 5vh', borderTopColor:'white', borderRadius:'0px 0px 5px 5px'}}>
            <img src ={logo} alt = "WeMoLogo" style= {{ display:'block', margin: '0 auto', paddingTop: '50px'}}/>            
            <div style ={{textAlign:'center', marginTop:'50px'}}>
                <form>
                    <TextField label="아이디" required /><br/>
                    <TextField label="비밀번호" required /><br/><br/>
                    <Button variant="outlined">로그인</Button>&nbsp;
                    <Button variant="outlined">회원가입</Button>
                </form>
            </div>
        </div>
    )
}

export default LoginMain
