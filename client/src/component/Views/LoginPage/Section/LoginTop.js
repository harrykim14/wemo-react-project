import React from 'react';
import { Typography } from '@material-ui/core';
import CropSquareIcon from '@material-ui/icons/CropSquare';
import CloseIcon from '@material-ui/icons/Close';
import MinimizeIcon from '@material-ui/icons/Minimize';

function LoginTop() {
    const thisYear = new Date().getFullYear() - 2000;
    const thisMonth = new Date().getMonth()+1;
    const thisDate = new Date().getDate();
    const today = `${thisYear}.${thisMonth < 10 ? 0+thisMonth : thisMonth}.${thisDate<10 ? 0+thisDate : thisDate}.`
    const iconStyle = { float: 'right'};
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
                    {today}
                    <CloseIcon style = {iconStyle}/>
                    <CropSquareIcon style = {iconStyle}/>
                    <MinimizeIcon style = {iconStyle}/>
                </Typography>
        </div>
    )
}

export default LoginTop
