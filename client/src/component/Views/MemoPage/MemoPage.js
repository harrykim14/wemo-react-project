import React, { useState, useEffect } from 'react'
import NavBar from '../NavBar/NavBar';
import MemoMain from './Section/MemoMain';
import Axios from 'axios';

function MemoPage(props) {

    // let exampleMemo = [
    //     { height: '250px', width: '250px', x: 30, y: 70, bgColor: '#F2D7B6', 
    //       memoNum : 0, memoContext: 'useState에 대해 알아보았어요', memoCategory : 'study', 
    //       memoLocked: false, memoImport: true, zIndex: 50, createDate: '12월 17일'},
    //     { height: '250px', width: '250px', x: 300, y: 70, bgColor: '#EBF2B6', 
    //       memoNum : 1, memoContext: '다이어트는 내일부터', memoCategory : 'workout',
    //       memoLocked: true, memoImport: false, zIndex: 51, createDate: '12월 17일'},
    //     ]

    const [MemoCategory, setMemoCategory] = useState('study');
    const [MemoProps, setMemoProps] = useState([]);    

    useEffect(() => {    
        let userId = {userId : localStorage.getItem('userId')}
        
        Axios.post('/api/getMemos', userId)
        .then(res => {
            // console.log(res.data)
            if(res.data.success){
                let allMemos = res.data.memos;
                let filteredMemos = allMemos.filter(memo => memo.memoCategory === MemoCategory)
                
                console.log(filteredMemos)
                setMemoProps(filteredMemos);
            }
        })        
    },[MemoCategory]) 

    useEffect(() => {       
     },[MemoProps])  

    const categoryHandler = (nowCategory) => {
        console.log("nav에서 누른 값:",nowCategory);
        setMemoCategory(prevCategory => nowCategory);
    }

    const memoPropChangeHandler = (data) => {
        console.log(data);
        let receivedNum = parseInt(data.memoNum, 10)

        switch (data.icon) {
            case "Star": MemoProps.forEach(memo => {
                if(memo.memoNum === receivedNum) memo.memoImport = !memo.memoImport;
            })
            setMemoProps(MemoProps);
            break;

            case "StarBorder": MemoProps.forEach(memo => {
                if(memo.memoNum === receivedNum) memo.memoImport = !memo.memoImport;
            })
            setMemoProps(MemoProps); 
            break;

            case "Lock": MemoProps.forEach(memo => {
                if(memo.memoNum === receivedNum) memo.memoLocked = !memo.memoLocked;
            })
            setMemoProps(MemoProps); 
            break;

            case "LockOpen": MemoProps.forEach(memo => {
                if(memo.memoNum === receivedNum) memo.memoLocked = !memo.memoLocked;
            })
            setMemoProps(MemoProps); 
            break;

            case "Palette": MemoProps.forEach(memo => {
                if(memo.memoNum === receivedNum) memo.bgColor = data.bgColor;
                console.log(data.bgColor)
            })
            setMemoProps(MemoProps); 
            break;

            case "Delete": 
                let memoPropsIndex = MemoProps.findIndex(memo => memo.memoNum === receivedNum);
                MemoProps.splice(memoPropsIndex, 1);
                console.log(MemoProps.length);
                setMemoProps(MemoProps); 
            break;
        
            default:
                break;
        }
    }

    const newMemoHandler = () => {
        /* 이미 있는 메모들을 돌며 z-index를 모든 메모보다 최대치로 설정하기 */
        let zidx = 0;
        let memoNum = 0;
        MemoProps.forEach(memo => {
            if(memo.zIndex > zidx) zidx = memo.zIndex + 1
            if(memo.memoNum > memoNum) memoNum = memo.memoNum + 1
        })
        console.log("z-index of new memo: ",zidx);
        console.log("New memo's number: ",memoNum);

        /* 오늘 날짜를 구해서 Date값을 형식에 맞춰 만들기 */
        let now = new Date();
        let createDate = `${(now.getMonth() < 10)? '0'+(now.getMonth()+1): now.getMonth()+1}월 ${(now.getDate() < 10) ? '0'+now.getDate(): now.getDate()}일`
        console.log(createDate)
        /* 새 메모를 디폴트 위치에 생성 */
        MemoProps.push({ height: '250px', width: '250px', // 수정 필요: userId를 넣어야 합니다
                         x: 30, y: 30, bgColor: '#b6f2cb', 
                         memoNum : memoNum, memoContext: '새 메모', 
                         memoCategory : MemoCategory,
                         memoLocked: false, memoImport: false, 
                         zIndex: zidx, createDate: createDate});
        setMemoProps(prevProps => [...MemoProps]);
    }

    const PositionChangeHandle = (locX, locY, memoNum) => {
        console.log("locX: ",locX," locY: ", locY, " Category:", MemoCategory)
        let idx = MemoProps.findIndex(memo => memo.memoNum === memoNum)
        console.log("지금 움직이는 메모 index: ", idx)
        MemoProps[idx].x = locX;
        MemoProps[idx].y = locY;
        setMemoProps(prevProps => [...MemoProps]);
    }

    const SizeChangeHandle = (x, y, w, h, memoNum) => {
        console.log("memoWidth:", w, " memoHeight:", h, " Category", MemoCategory)
        let idx = MemoProps.findIndex(memo => memo.memoNum === memoNum)
        MemoProps[idx].x = x;
        MemoProps[idx].y = y;
        MemoProps[idx].width = w;
        MemoProps[idx].height = h;
        setMemoProps(prevProps => [...MemoProps]);
    }

    return (
        <div>
                <NavBar 
                    nowCategory={categoryHandler}
                    newMemoHandler ={newMemoHandler}
                />
            <div style = {{ height: '85vh'}}>
                <MemoMain 
                    memoCategory={MemoCategory} 
                    memoProps={MemoProps}
                    memoPropChange={memoPropChangeHandler}                    
                    PositionChangeHandle = {PositionChangeHandle}
                    SizeChangeHandle = {SizeChangeHandle}
                />
            </div>
        </div>
    )
}

export default MemoPage
