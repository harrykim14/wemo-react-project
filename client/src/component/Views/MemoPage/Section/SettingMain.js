import React, { useState } from 'react'
import { TextField , Button } from "@material-ui/core";
import './SettingMain.css';

function SettingMain() {

    // eslint-disable-next-line
    const [UserPassword, setUserPassword] = useState('');
    // eslint-disable-next-line
    const [UserPhoneNumber, setUserPhoneNumber] = useState('');
    // eslint-disable-next-line
    const [AutoFormArr, setAutoFormArr] = useState(['', '', ''])

    const textChange = (e) => {
        let parentElement = e.currentTarget.closest('.MuiFormControl-root').getAttribute('data-value');
        (parentElement === "Password") ? console.log("Password") : console.log("No")
    }
    

    return (
        <div className="SettingBoard">
            <form method="post" /*onSubmit*/>
                <TextField label="아이디(이메일 주소)"
                            margin="dense"
                            value
                            fullWidth={true}
                            aria-readonly={true}/>
                <br/>
                <span className="SettingDescription">아이디는 변경하실 수 없습니다</span>
                <br/>
                <TextField label="비밀번호" type="password"
                            margin="normal"
                            data-value="Password"
                            onChange={textChange}
                            value={UserPassword}
                            fullWidth={true}
                            required/>
                <br/>
                <span className="SettingDescription">변경을 원하신다면 비밀번호는 최소 8자리 이상 입력해주세요</span>
                <br/>
                <TextField label="핸드폰 번호"
                            margin="normal"
                            data-value="PhoneNumber"
                            onChange={textChange}
                            value={UserPhoneNumber}
                            fullWidth={true}
                            required/>
                <br/>
                <span className="SettingDescription">변경을 원하신다면 핸드폰 번호 13자리를 입력해주세요</span>
                <br/>
                <TextField label="자동완성 폼1"
                            margin="normal"
                            data-value="Userform1"
                            onChange={textChange}
                            value = {AutoFormArr[0]}
                            fullWidth={true}
                            required />
                <br/>
                <span className="SettingDescription">자주 사용하는 문구 등을 자동완성 폼으로 설정하세요</span>
                <br/>
                <TextField label="자동완성 폼2"
                            margin="normal"
                            data-value="Userform2"
                            onChange={textChange}
                            value = {AutoFormArr[1]}
                            fullWidth={true}
                            required />
                <br/>
                <span className="SettingDescription">자동완성 폼은 메모장 안에서 Ctrl+SpaceBar(1번), Ctrl+Q(2번), Ctrl+B(3번)로 불러올 수 있습니다</span>
                <br/>
                <TextField label="자동완성 폼3"
                            margin="normal"
                            data-value="Userform3"
                            onChange={textChange}
                            value = {AutoFormArr[2]}
                            fullWidth={true}
                            required />
                <br/>
                <span className="SettingDescription">자동완성 폼은 최대 세 개까지 등록하실 수 있습니다</span>
                <br/><br/>
                <Button 
                    variant="contained" 
                    size="large"
                    style={{ float:"right", fontSize:'14pt', fontWeight:700}}
                    type="submit" /*onClick*/ >
                    설정 저장하기
                </Button>
            </form>
        </div>
    )
}

export default SettingMain
