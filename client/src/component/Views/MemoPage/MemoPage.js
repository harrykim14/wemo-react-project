import React, { useState, useEffect } from 'react'
import NavBar from '../NavBar/NavBar';
import MemoMain from './Section/MemoMain';
import Axios from 'axios';

function MemoPage(props) {

    const [MemoCategory, setMemoCategory] = useState('study');
    const [MemoProps, setMemoProps] = useState([]);    

    useEffect(() => {    
        let userId = {userId : localStorage.getItem('userId')}
        
        Axios.post('/api/getMemos', userId)
            .then(res => {
                if(res.data.success){
                    let allMemos = res.data.memos;
                    let filteredMemos = allMemos.filter(memo => memo.memoCategory === MemoCategory && memo.memoTrash === false)
                    setMemoProps(filteredMemos);
                }
            })        
    },[MemoCategory]) 

    useEffect(() => {       
     },[MemoProps])  

    const categoryHandler = (nowCategory) => {
        setMemoCategory(prevCategory => nowCategory);
    }

    const memoPropChangeHandler = (data) => {

        switch (data.icon) {
            case "Star": 
                let unMarkObj = { memoId: data._id, memoImport: false }
                Axios.post('/api/markOrUnmark', unMarkObj)
                    .then(res => {
                        if(res.data.success) console.log("중요 메모에서 해제하였습니다.")
                    })
                MemoProps.forEach(memo => {
                    if(memo._id === data._id) memo.memoImport = !memo.memoImport;
                })
                setMemoProps(prevMemoProps => [...MemoProps]);
            break;

            case "StarBorder": 
                let markObj = { memoId: data._id, memoImport: true}
                Axios.post('/api/markOrUnmark', markObj)
                    .then(res => {
                        if(res.data.success) console.log("메모를 중요표시하였습니다.")
                    })
                MemoProps.forEach(memo => {
                    if(memo._id === data._id) memo.memoImport = !memo.memoImport;
                })
                setMemoProps(prevMemoProps => [...MemoProps]); 
            break;

            case "Lock": 
                let lockObj = { memoId: data._id, memoLocked: true }
                Axios.post('/api/lockOrUnlock', lockObj)
                    .then(res => {
                        if(res.data.success) console.log("메모를 잠금 하였습니다.")
                        else console.log("메모 잠금에 실패하였습니다.")
                    })
                MemoProps.forEach(memo => {
                    if(memo._id === data._id) memo.memoLocked = !memo.memoLocked;
                })
                setMemoProps(prevMemoProps => [...MemoProps]); 
            break;

            case "LockOpen": 
                let lockOpenObj = { memoId: data._id, memoLocked: false }
                Axios.post('/api/lockOrUnlock', lockOpenObj)
                    .then(res => {
                        if(res.data.success) console.log("메모 잠금을 해제하였습니다.")
                        else console.log("메모 잠금 해제에 실패하였습니다.")
                    })
                MemoProps.forEach(memo => {
                    if(memo._id === data._id) memo.memoLocked = !memo.memoLocked;
                })
                setMemoProps(prevMemoProps => [...MemoProps]); 
            break;

            case "Palette": 
                let bgColorObj = { memoId: data._id, bgColor: data.bgColor };
                Axios.post('/api/paintMemo', bgColorObj)
                    .then(res => {
                        if(res.data.success) console.log("메모의 배경색을 성공적으로 변경하였습니다.")
                        else console.log("배경색 변경에 실패하였습니다.");
                    })

                MemoProps.forEach(memo => {
                    if(memo._id === data._id) memo.bgColor = data.bgColor;
                })
                setMemoProps(prevMemoProps => [...MemoProps]); 
            break;

            case "Delete": 
                if(MemoCategory !== "trash") { 
                    let deleteObj = { memoId: data._id, memoTrash: true }
                    Axios.post('/api/throwOrRestore', deleteObj)
                        .then(res => {
                            if(res.data.success) console.log("메모를 휴지통으로 이동시켰습니다")
                        })

                    let memoPropsIndex = MemoProps.findIndex(memo => memo._id === data._id);
                    MemoProps.splice(memoPropsIndex, 1);
                    setMemoProps(prevMemoProps => [...MemoProps]); 
                } else {
                    return false;
                }
            break;
        
            default:
                break;
        }
    }

    const newMemoHandler = () => {
        /* 이미 있는 메모들을 돌며 z-index를 모든 메모보다 최대치로 설정하기 */
        let zidx = 0;
        MemoProps.forEach(memo => {
            if(memo.zIndex > zidx) zidx = memo.zIndex + 1
        })
        console.log("z-index of new memo: ",zidx);

        /* 오늘 날짜를 구해서 Date값을 형식에 맞춰 만들기 */
        let now = new Date();
        let createDate = `${(now.getMonth() < 10)? '0'+(now.getMonth()+1): now.getMonth()+1}월 ${(now.getDate() < 10) ? '0'+now.getDate(): now.getDate()}일`
        console.log(createDate)

        /* 새 메모 객체를 생성 */
        const newMemoObj = { 
            writer: localStorage.getItem('userId'),
            memoCategory : MemoCategory,
            height: '250px', width: '250px',
            x: 30, y: 30, 
            bgColor: '#b6f2cb',
            memoContext: '새 메모', 
            memoLocked: false, memoImport: false, memoTrash: false,
            zIndex: zidx, createDate: createDate}

        /* 새 메모 객체를 DB에 새로 생성 */
        Axios.post('/api/createMemo', newMemoObj)
             .then(res => {
                if(res.data.success) MemoProps.push(res.data.createMemo)
                else return alert('메모를 생성하는데 실패하였습니다 다시 시도해주세요.')
             })
             .then(() => { 
                setMemoProps(prevProps => [...MemoProps])
             })        
    }

    const PositionChangeHandle = (locX, locY, memoId) => {
        
        let idx = MemoProps.findIndex(memo => memo._id === memoId);
        MemoProps[idx].x = locX;
        MemoProps[idx].y = locY;
        setMemoProps(prevProps => [...MemoProps]);    

        let positionObj = {memoId:memoId, x: locX, y: locY};
        Axios.post('/api/moveMemo', positionObj)
             .then(res => {
                 if(res.data.success) console.log("메모를 정상적으로 드래그 완료하였습니다.")
                 else console.log("드래그에 실패하였습니다 다시 시도해주세요")
             })        
    }

    const SizeChangeHandle = (x, y, w, h, memoId) => {

        let idx = MemoProps.findIndex(memo => memo._id === memoId)
        MemoProps[idx].x = x;
        MemoProps[idx].y = y;
        MemoProps[idx].height = h;
        MemoProps[idx].width = w;
        setMemoProps(prevProps => [...MemoProps]);

        let sizeObj = {memoId: memoId, height: h, width: w}
        Axios.post('/api/resizeMemo', sizeObj)
            .then(res => {
                if(res.data.success) console.log("메모를 정상적으로 리사이즈 하였습니다.")
                else console.log("리사이징에 실패하였습니다 다시 시도해주세요")
            })      
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
