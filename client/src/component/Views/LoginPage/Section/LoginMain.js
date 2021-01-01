import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import { TextField , Button } from "@material-ui/core";
import WeMoLogo200 from '../../../../Images/WemoLogo_200px.png'
import WeMoLogo400 from '../../../../Images/WemoLogo_400px.png'
import Axios from 'axios';

function LoginMain(props) {

    let history = useHistory();
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
        // axios로 db에 있는 아이디를 검색해서 맞는지 확인하기
        let data4Login = { 
            userId: UserId, password: UserPassword
        }
        Axios.post('/api/login', data4Login)
            .then(res => { 
                console.log(res.data);
                // 맞다면 props.history.push()로 main페이지로 날리기
                if(res.data.loginSuccess){
                    window.localStorage.setItem('userId', res.data.userId);
                    history.push('/main');
                } else {
                     // 아니라면 뭐가 틀렸는지 알려주기 (아이디가 없습니다 or 패스워드가 틀렸습니다 등)
                    if(res.data.message) alert(res.data.message);
                    else alert("로그인 중 오류가 발생하였습니다 나중에 다시 시도해주세요.")
                }
            })    
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

export default LoginMain;
