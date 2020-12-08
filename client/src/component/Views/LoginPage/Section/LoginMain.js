import React, { useState, useEffect } from 'react'
import { TextField , Button } from "@material-ui/core";
import WeMoLogo200 from '../../../../Images/WemoLogo_200px.png'
import WeMoLogo400 from '../../../../Images/WemoLogo_400px.png'

function LoginMain(props) {

    const [logo, setLogo] = useState(WeMoLogo400);
    const [UserId, setUserId] = useState('');
    const [UserPassword, setUserPassword] = useState('');

    useEffect(() => {
        (window.innerWidth > 480) ? setLogo(WeMoLogo400) : setLogo(WeMoLogo200);
    }, [])
    
    const idInputHandler = (event) => {
        setUserId(event.currentTarget.value);
    }

    const pwInputHandler = (event) => {
        setUserPassword(event.currentTarget.value);
    }

    const loginHandler = () => {
        if (!UserId && !UserPassword) alert('아이디와 비밀번호를 모두 입력해주세요.')
        console.log(UserId, UserPassword);
    }

    

    return (
        <div style= {{ border : '2px solid black', height: '70vh', margin: '0vh 5vh 0vh 5vh', borderTopColor:'white', borderRadius:'0px 0px 5px 5px'}}>
            <img src ={logo} alt = "WeMoLogo" style= {{ display:'block', margin: '0 auto', paddingTop: '50px'}}/>            
            <div style ={{textAlign:'center', marginTop:'50px'}}>
                <form method="post" onSubmit={loginHandler}>
                    <TextField label="아이디" value = {UserId} onChange={idInputHandler} required /><br/>
                    <TextField label="비밀번호" type="password" value = {UserPassword} onChange={pwInputHandler} required /><br/><br/>
                    <Button variant="outlined" onClick = {loginHandler}>로그인</Button>&nbsp;
                    <Button variant="outlined" href='/register'>회원가입</Button>
                </form>
            </div>
        </div>
    )
}

export default LoginMain
