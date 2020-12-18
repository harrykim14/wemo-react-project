import React, {useState} from 'react';
import './NavBar.css';

function NavBar(props) {
    let navBarContext = [
        { value: "study", text: "공부", bgColor: "#68CD2F" },
        { value: "workout", text: "운동", bgColor: "#FFDBA7" },
        { value: "money", text: "가계부", bgColor: "#FEC834" },
        { value: "calendar", text: "캘린더", bgColor: "#FF7930" },
        { value: "important", text: "보관함", bgColor: "#D00002" },
        { value: "trash", text: "휴지통", bgColor: "#D19D52" },
        { value: "analysis", text: "통계", bgColor: "#96B1D0" },
        { value: "setting", text: "설정", bgColor: "#AC99C1" }
    ]

    const [DisplayBottom, setDisplayBottom] = useState(false);
    const [NavBarBottom, setNavBarBottom] = useState([]);

    const categoryClickHandler = (e) => {
        e.preventDefault();
        let categoryName = e.currentTarget.getAttribute('value');
        // event.currentTarget.value가 undefinded로 출력된다면 getAttribute 메서드를 사용하기
        props.nowCategory(categoryName)
        /* 처음 메뉴버튼을 클릭할 때 */
        if (!DisplayBottom){
            let navBarBottom = navBarContext.map(item => {
                if(categoryName === item.value){
                    /* 카테고리가 공부, 운동, 가계부가 아니라면 빈 텍스트를 가진 객체를 리턴 */
                    return (categoryName === 'study' || categoryName === 'workout' || categoryName === 'money') ? 
                    { value: item.value, text: '새 메모', bgColor: item.bgColor} :
                    { value : item.value, text: '', bgColor: item.bgColor}
                }
                /* 나머지 카테고리는 투명한 배경을 가지도록 transparent 속성의 객체를 리턴 */ 
                else return { value: '', text: '', bgColor: 'transparent'}
            })
            setNavBarBottom(navBarBottom);
            setDisplayBottom(!DisplayBottom);            
        }
        /* 만약에 이미 클릭한 상태에서 다른 메뉴를 클릭할 때 */
         else {
            let navBarBottom = navBarContext.map(item => {
                if(categoryName === item.value){
                    /*  */
                    return (categoryName === 'study' || categoryName === 'workout' || categoryName === 'money') ? 
                    { value: item.value, text: '새 메모', bgColor: item.bgColor} :
                    { value : item.value, text: '', bgColor: item.bgColor}
                } else return { value: '', text: '', bgColor: 'transparent'}
            })
            setNavBarBottom(navBarBottom);
        }
    }
    
    const newMemoHandler = (e) => {
        if(e.currentTarget.innerText !== '새 메모')
        return false
        else 
        props.newMemoHandler()
    }

    return (
        <>
        <div className = "navbarGroup">
        {navBarContext.map((item, idx)=>(
            <div 
                key = {idx} 
                className = "navTop"
                value ={item.value}
                onClick ={categoryClickHandler}
                style = {{ backgroundColor:item.bgColor}}>
                {item.text}
            </div>
        ))}
        </div>
        <div className = "navbarBottomGroup">
        { DisplayBottom && NavBarBottom.map((item, idx) => (
            <div
                key = {`navBottom-${idx}`}
                className = "navBottom"
                value = {item.value}
                onClick ={newMemoHandler}
                style = {{ backgroundColor:item.bgColor }}>
                {item.text}
            </div>
        ))}
        </div>
        </>
    )
}

export default NavBar
