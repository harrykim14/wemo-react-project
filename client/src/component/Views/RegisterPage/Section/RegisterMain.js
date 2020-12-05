import React, { useState } from 'react'
import { TextField , Button } from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import Terms from '../TermsData/TermsData.json';

function RegisterMain() {

    const [UserId, setUserId] = useState('');
    const [UserName, setUserName] = useState('');
    const [UserEmail, setUserEamil] = useState('');
    const [UserPassword, setUserPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    // const [CheckPassword, setCheckPassword] = useState('암호를 입력해주세요.')

    const handleUserIDInput = (event) => {
        setUserId(event.currentTarget.value)
    } 
    const handleUserNameInput = (event) => {
        setUserName(event.currentTarget.value)
    } 
    const handleUserEmailInput = (event) => {
        setUserEamil(event.currentTarget.value)
    } 
    const handleUserPasswordInput = (event) => {
        setUserPassword(event.currentTarget.value)
    } 
    const handleConfirmPasswordInput = (event) => {
        setConfirmPassword(event.currentTarget.value)
        // checkPasswordInputs()
    }
    // const checkPasswordInputs = () => {
    //     if(UserPassword.length > 0 && UserPassword === ConfirmPassword){
    //         setCheckPassword('입력한 두 암호가 일치합니다.')
    //     } else {
    //         setCheckPassword('암호를 올바르게 두 번 입력 해 주세요.')
    //     }
    // }

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
                <form onSubmit>
                    <TextField label="아이디" onChange = {handleUserIDInput} value={UserId} required/>
                    <Button variant="outlined">중복확인</Button><br/><br/>
                    <TextField label="사용자 이름" onChange = {handleUserNameInput} value = {UserName} required/><br/><br/>
                    <TextField label="이메일 주소" onChange = {handleUserEmailInput} value = {UserEmail} required /><br/><br/>
                    <TextField label="비밀번호" type="password" onChange = {handleUserPasswordInput} value = {UserPassword}  required />
                    <br/><br/>
                    <TextField label="비밀번호 확인" type="password" 
                               onChange = {handleConfirmPasswordInput} 
                               value = {ConfirmPassword}  required />
                    <br/><span>{/*CheckPassword*/}</span><br/><br/>
                    <Button variant="outlined">회원가입</Button>&nbsp;
                    <Button variant="outlined">돌아가기</Button>
                </form>
            </div>
            <div style ={{ margin:'5vh 5vh 0vh 15vh'}} >
                {Terms.Context}
            <br/>
            <Checkbox color ="default" inputProps={{ 'aria-label': 'checkbox with default color' }}/>
            해당 내용에 동의합니다.
            </div>
        </div>
    )
}

export default RegisterMain
