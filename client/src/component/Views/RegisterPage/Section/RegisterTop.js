import React from 'react'
import { Typography } from '@material-ui/core';
import CropSquareIcon from '@material-ui/icons/CropSquare';
import CloseIcon from '@material-ui/icons/Close';
import MinimizeIcon from '@material-ui/icons/Minimize';
const iconStyle = { float: 'right'};
function RegisterTop() {
    return (
        <div style = {{ 
            border: '2px solid black',
            margin : '10vh 5vh 0vh 5vh',
            borderRadius: '10px 10px 0px 0px',
            height: '25px',
            lineHeight : '25px',
            padding : '5px',
            backgroundColor:'pink'
            }}>
                <Typography variant ={'body1'} 
                            style = {{fontWeight: '700', fontSize: '1.2rem'}}>
                    회원가입을 하시려면 아래 양식에 맞춰 입력해주세요.
                    <CloseIcon style = {iconStyle}/>
                    <CropSquareIcon style = {iconStyle}/>
                    <MinimizeIcon style = {iconStyle}/>
                </Typography>
        </div>
    )
}

export default RegisterTop
