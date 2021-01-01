import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import { TextField , Button } from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import Terms from '../TermsData/TermsData.json';
import Axios from 'axios';

function RegisterMain(props) {

    let history = useHistory();
    const [UserId, setUserId] = useState('');
    const [UserName, setUserName] = useState('');
    const [UserPassword, setUserPassword] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [TermAgreement, setTermAgreement] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleUserIDInput = (event) => {
        setUserId(event.currentTarget.value)
        // 입력한 내용을 지우고 다시 입력하게 되면 isConfirm값을 false로 변경해주어야 함
        setIsConfirmed(false);
    } 
    const handleUserNameInput = (event) => {
        setUserName(event.currentTarget.value)
    } 
    const handleUserPasswordInput = (event) => {
        setUserPassword(event.currentTarget.value)
    } 
    const handlePhoneNumberInput = (event) => {
        setPhoneNumber(event.currentTarget.value)
    }
    const isIdUnique = (event) => {
        if (UserId.length === 0) {
            alert("아이디를 입력해주세요.")
            return false;
        }

        const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if (regExp.test(UserId)){
            // DB에서 id 중복 검사
            Axios.post('/api/isUniqueId', {userId: UserId})
                .then(response => { 
                    console.log(response.data)
                    if(response.data.success) {
                        if(response.data.findUserId.length>0){
                            alert("중복된 아이디입니다 다시 입력해주세요");
                            setUserId('');
                        } else {
                            setIsConfirmed(true);
                        }
                    } else {
                        // 있으면 다시 입력해달라고 하고 return false
                        alert("아이디 검사에 실패하였습니다. 다시 시도해주세요.")
                    }
                }) 
        } else {
            alert("이메일 형식에 맞춰 입력해주세요.")
            return false;
        } 
    }

    const termCheckhandler = () => {
        setTermAgreement(!TermAgreement)
    }
    
    const registerUserFunction = (event) => {
        event.preventDefault();
        if(!TermAgreement) {
            alert('회원약관에 동의해주세요.')
            return false;
        }
        if(!isConfirmed) {
            alert('ID 중복검사가 필요합니다')
            return false;
        }
        if(UserPassword.length < 8) {
            alert('비밀번호는 8자 이상이어야합니다.')
            setUserPassword('');
            return false;
        }  

        const regExp = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
        if(!regExp.test(PhoneNumber) || PhoneNumber.length < 11){
            alert("형식에 맞는 핸드폰 번호를 입력해주세요")
            return false;
        }

        if(UserId && UserName &&  UserPassword && PhoneNumber) {
            let body = {
                userId : UserId,               
                password : UserPassword,
                userName : UserName,
                phoneNumber : PhoneNumber
            }
            Axios.post('/api/userRegister', body)
                .then(response => {
                    console.log(response.data)
                    if(response.data.success) {
                        alert('회원가입에 성공하였습니다. 로그인 페이지로 이동합니다.')
                        setTimeout(() => {                            
                            history.push('/')
                        }, 1000);
                    } else {
                        alert('회원가입에 실패하였습니다. 다시 시도해주세요.')
                    }
                })
        } else {
            alert('모든 칸을 입력하셔야 회원가입을 진행하실 수 있습니다.')
        }
        console.log("form contexts" ,UserId, UserName, UserPassword, PhoneNumber)
    }

    return (
        <div style= {{ 
            border : '2px solid black', 
            height: '70vh', 
            margin: '0vh 5vh 0vh 5vh', 
            borderTopColor:'white', 
            borderRadius:'0px 0px 5px 5px',
            display: 'flex',
            flexWrap: 'row wrap'
        }}>            
            <div style ={{ margin:'5vh 5vh 0vh 15vh'}}>
                <form method="post" onSubmit = {registerUserFunction}>
                    <TextField label="아이디(이메일 주소)" 
                               onChange = {handleUserIDInput} 
                               value={UserId} required/>

                    <Button variant="outlined" 
                            style={isConfirmed ? {background: "pink", fontWeight:"700"} : { background: "#dddddd" }}
                            onClick={isIdUnique}>
                    중복확인
                    </Button><br/>
                    <span>이메일 주소를 입력해주세요</span>
                    <br/>
                    <TextField label="비밀번호" type="password" 
                               onChange = {handleUserPasswordInput}
                               value = {UserPassword} required/>
                    <br/>
                    <span>비밀번호는 최소 8자리 이상 입력해주세요</span>
                    <br/>
                    <TextField label="사용자 이름" 
                               onChange = {handleUserNameInput} 
                               value = {UserName} required/>
                    <br/>
                    <span>이름을 입력해주세요</span>
                    <br/>                   
                    <TextField label="핸드폰 번호" 
                               onChange = {handlePhoneNumberInput} 
                               value = {PhoneNumber} required/>
                    <br/>
                    <span>핸드폰 번호 13자리를 입력해주세요</span>
                    <br/><br/><br/>
                    <Button variant="outlined" type="submit" onClick={registerUserFunction}>회원가입</Button>&nbsp;
                    <Button variant="outlined" href ='/'>돌아가기</Button>
                </form>
            </div>
            <div style ={{ margin:'5vh 5vh 0vh 15vh', width: '35%', }} >
                <div style = {{ border:'1px solid lightgray', height: '40vh', textAlign:'center', paddingTop: '5vh'}}>
                {Terms.Context}
                </div>
                <Checkbox color ="default" inputProps={{ 'aria-label': 'checkbox with default color' }} onClick={termCheckhandler} value={TermAgreement}/>
                <span>해당 내용에 동의합니다.</span>
            <br/>                
            </div>
           
        </div>
    )
}

export default RegisterMain
