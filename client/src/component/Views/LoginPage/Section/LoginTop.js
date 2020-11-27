import React from 'react'
import close from './pics/close.png';
import crop from './pics/crop.png';
import minimize from './pics/minimize.png';

function LoginTop() {
    const thisYear = new Date().getFullYear() - 2000;
    const thisMonth = new Date().getMonth()+1;
    const thisDate = new Date().getDate();
    const today = `${thisYear}.${thisMonth < 10 ? 0+thisMonth : thisMonth}.${thisDate<10 ? 0+thisDate : thisDate}.`

    return (
        <div style = {{ 
            border: '2px solid black',
            margin : '10vh 5vh 0vh 5vh',
            width : '90%',
            borderRadius: '10px 10px 0px 0px',
            height: '20px',
            lineHeight : '20px',
            padding : '5px',
            fontWeight: '700',
            backgroundColor:'pink'
            }}>
                <span>{today}</span>
                <img src = {close} alt="close" style = {{float:'right'}}/>
                <img src = {crop} alt="crop" style = {{float:'right'}}/>
                <img src = {minimize} alt='minimize' style = {{float:'right'}}/>
        </div>
    )
}

export default LoginTop
