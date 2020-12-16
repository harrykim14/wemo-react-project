import React from 'react';
import './Header.css';

function Header(props) {
    let navBarContext = [
        {
            value: "study",
            text: "공부",
            bgColor: "#68CD2F"
        },
        {
            value: "workout",
            text: "운동",
            bgColor: "#FFDBA7"
        },
        {
            value: "money",
            text: "가계부",
            bgColor: "#FEC834"
        },
        {
            value: "calendar",
            text: "캘린더",
            bgColor: "#FF7930"
        },
        {
            value: "important",
            text: "보관함",
            bgColor: "#D00002"
        },
        {
            value: "trash",
            text: "휴지통",
            bgColor: "#D19D52"
        },
        {
            value: "analysis",
            text: "통계",
            bgColor: "#682F02"
        },
        {
            value: "setting",
            text: "설정",
            bgColor: "#018136"
        }
    ]

    const onClickHandler = (event) => {
        event.preventDefault();
        let categoryName = event.currentTarget.getAttribute('value');
        console.log(categoryName)
        // event.currentTarget.value가 undefinded로 출력된다면 getAttribute 메서드를 사용해보자
        props.nowCategory(categoryName)
    }

    return (
        <div className = "navbarGroup">
        {navBarContext.map((item, idx)=>(
            <div 
                key = {idx} 
                className = "navbarItem"
                value ={item.value}
                onClick ={onClickHandler}
                style = {{ backgroundColor:item.bgColor}}>
                {item.text}
            </div>
        ))}
        </div>
    )
}

export default Header
