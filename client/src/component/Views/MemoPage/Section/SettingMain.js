import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { TextField , Button } from "@material-ui/core";
import './SettingMain.css';

function SettingMain() {

    useEffect(() => {

        let userId = localStorage.getItem('userId')
        Axios.get(`/api/findUserInfo/${userId}`)
            .then(res => {
                if(res.data.success) {
                    let userInfo = res.data.user;
                    let userSetting = { 
                            UserId: userInfo.userId,
                            UserPassword: '',
                            UserPhoneNumber: userInfo.phoneNumber,
                            Userform1: userInfo.userAutoform.Userform1,
                            Userform2: userInfo.userAutoform.Userform2,
                            Userform3: userInfo.userAutoform.Userform3 
                        }                 
                    setSettingForm(userSetting)
                }
            })
        
    }, [])

    const [SettingForm, setSettingForm] = useState({});

    const {UserId, UserPassword, UserPhoneNumber, Userform1, Userform2, Userform3} = SettingForm

    const sectionHandelr = (e) => {
        let target = e.currentTarget
                    .closest('.MuiFormControl-root')
                    .getAttribute('data-value');
        let text = e.currentTarget.value;
        return textChangeHandler(target, text);
    }

    const textChangeHandler = (target, text) => {
        switch (target) {
            case "Password":
                setSettingForm({ ...SettingForm, UserPassword: text})
                break;
            case "PhoneNumber":
                setSettingForm({ ...SettingForm, UserPhoneNumber: text})
                break;
            case "Userform1":
                setSettingForm({ ...SettingForm, Userform1: text})
                break;
            case "Userform2":
                setSettingForm({ ...SettingForm, Userform2: text})
                break;
            case "Userform3":
                setSettingForm({ ...SettingForm, Userform3: text})
                break;       
            default: break;
        }
    }

    const submitHandler = () => {
        if(SettingForm["UserPassword"] === '' || SettingForm["UserPhoneNumber"] === '') { 
            alert("비밀번호와 핸드폰 번호는 반드시 입력해주세요")
            return false;
        }
        let data = {...SettingForm, userId: localStorage.getItem('userId')} 
        Axios.post('/api/updateUserSetting', data)
            .then(res => {
                if(res.data.saveSuccess) console.log('설정을 무사히 저장하였습니다')
                else alert(res.data.message);
            })
        console.log(SettingForm)
    }
    
    // eslint-disable-next-line
    const copyUserFormHandler = (e) => {
        let INPUT_KEYVALUE = e.which;
        console.log(INPUT_KEYVALUE);
    }

    return (
        <div className="SettingBoard" >
            <form method="post" onSubmit = {(e) => e.preventDefault()}>
                <label className="SettingLabel">아이디(이메일 주소)</label>
                <TextField 
                    margin="dense"
                    value={UserId}
                    fullWidth={true}
                    disabled={true}
                    aria-readonly={true}/>
                <br/>
                <span className="SettingDescription">아이디는 변경하실 수 없습니다</span>
                <br/>
                <label className="SettingLabel">비밀번호</label>
                <TextField  
                    type="password"
                    margin="dense"
                    data-value="Password"
                    onChange={sectionHandelr}
                    value={UserPassword}
                    fullWidth={true}
                    required/>
                <br/>
                <span className="SettingDescription">설정을 변경할 때엔 현재 비밀번호를 반드시 입력해주세요</span>
                <br/>
                <label className="SettingLabel">핸드폰 번호</label>
                <TextField 
                    margin="dense"
                    data-value="PhoneNumber"
                    onChange={sectionHandelr}
                    value={UserPhoneNumber}
                    fullWidth={true}
                    required />
                <br/>
                <span className="SettingDescription">변경을 원하신다면 핸드폰 번호 13자리를 입력해주세요</span>
                <br/>
                <label className="SettingLabel">자동완성 폼1</label>
                <TextField
                    margin="dense"
                    data-value="Userform1"
                    onChange={sectionHandelr}
                    value = {Userform1}
                    fullWidth={true} />
                <br/>
                <span className="SettingDescription">자주 사용하는 문구 등을 자동완성 폼으로 설정하세요</span>
                <br/>
                <label className="SettingLabel">자동완성 폼2</label>
                <TextField 
                    margin="dense"
                    data-value="Userform2"
                    onChange={sectionHandelr}
                    value = {Userform2}
                    fullWidth={true} />
                <br/>
                <span className="SettingDescription">자동완성 폼은 메모장 안에서 Ctrl+SpaceBar(1번), Ctrl+Q(2번), Ctrl+B(3번)로 불러올 수 있습니다</span>
                <br/>
                <label className="SettingLabel">자동완성 폼3</label>
                <TextField 
                    margin="dense"
                    data-value="Userform3"
                    onChange={sectionHandelr}
                    value = {Userform3}
                    fullWidth={true} />
                <br/>
                <span className="SettingDescription">자동완성 폼은 최대 세 개까지 등록하실 수 있습니다</span>
                <br/>
                <Button 
                    variant="contained" 
                    size="large"
                    style={{ float:"right", fontSize:'14pt', fontWeight:700}}
                    type="submit" onClick={submitHandler} >
                    설정 저장하기
                </Button>
            </form>
        </div>
    )
}

export default SettingMain
