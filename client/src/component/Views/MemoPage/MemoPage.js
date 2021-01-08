import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import NavBar from '../NavBar/NavBar';
import MemoMain from './Section/MemoMain';
import LogoutMain from './Section/LogoutMain';
import AnalysisMain from './Section/AnalysisMain';
import Axios from 'axios';

function MemoPage(props) {

    let history = useHistory();
    const [MemoCategory, setMemoCategory] = useState('study');
    const [MemoProps, setMemoProps] = useState([]);
    const [AnalysisPage, setAnalysisPage] = useState(false);
    const [LogoutPage, setLogoutPage] = useState(false);    

    useEffect(() => {

    /*
        // 01-05: filter 처리한 메모가 다른 카테고리에서도 적용되는 버그 발견
        // 01-06: MemoProps를 useEffect로 다시 렌더링 될 때 처음 빈 배열로 초기화 하면 해결됨
        // 01-07: getMemos를 post방식에서 get 방식으로 변경
        // 01-07: 공통부분을 바깥에서 처리하게 변경하고 카테고리에 따라 필터링하는 함수를 분리함
    */
        let userId = localStorage.getItem('userId')
    
        Axios.get(`/api/getMemos/${userId}`)
                .then(res => {
                    let allMemos = [];
                    if(res.data.success){
                        allMemos = res.data.memos;
                        filterMemosByCategory(allMemos)
                    }                   
                })
    // eslint-disable-next-line
    },[MemoCategory]) 

    useEffect(() => {
     },[MemoProps])  

    const categoryHandler = (nowCategory) => {
        setMemoCategory(prevCategory => nowCategory);
    }

    function filterMemosByCategory (allMemos) {

        setLogoutPage(false);
        setAnalysisPage(false);
        setMemoProps([]);

        if (MemoCategory === 'logout') {
            setLogoutPage(true);
        } else if (MemoCategory === 'analysis') {
            setAnalysisPage(true);
        } else if (MemoCategory === 'trash') {       
            setMemoProps(allMemos.filter(memo => memo.memoTrash === true));
        } else if (MemoCategory === 'important'){ 
            setMemoProps(allMemos.filter(memo => memo.memoImport === true));
        } else { 
            setMemoProps(allMemos.filter(memo => memo.memoCategory === MemoCategory 
                                              && memo.memoTrash === false));
        }
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

            // 01-05: Lock과 unLock 로직 오류 발견 및 수정
            case "Lock": 
                let lockObj = { memoId: data._id, memoLocked: false }
                Axios.post('/api/lockOrUnlock', lockObj)
                    .then(res => {
                        if(res.data.success) console.log("메모를 잠금 해제 하였습니다.")
                        else console.log("메모 잠금 해제에 실패하였습니다.")
                    })
                MemoProps.forEach(memo => {
                    if(memo._id === data._id) memo.memoLocked = !memo.memoLocked;
                })
                setMemoProps(prevMemoProps => [...MemoProps]); 
            break;

            case "LockOpen": 
                let lockOpenObj = { memoId: data._id, memoLocked: true }
                Axios.post('/api/lockOrUnlock', lockOpenObj)
                    .then(res => {
                        if(res.data.success) console.log("메모 잠금 하였습니다.")
                        else console.log("메모 잠금에 실패하였습니다.")
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
                if(MemoCategory === "trash") { 
                    Axios.delete(`/api/deleteMemo/${data._id}`)
                        .then(res => {
                            if(res.data.success) console.log("메모를 완전 삭제하였습니다")
                        })
                } else {
                    let deleteObj = { memoId: data._id, memoTrash: true }
                    Axios.post('/api/throwOrRestore', deleteObj)
                        .then(res => {
                            if(res.data.success) console.log("메모를 휴지통으로 이동시켰습니다")
                        })
                }
                let memoPropsIndex =indexFinder(data._id)
                MemoProps.splice(memoPropsIndex, 1);
                setMemoProps(prevMemoProps => [...MemoProps]); 
            break;
        
            default:
                break;
        }
    }

    // 01-05: newMemoHandler를 함수 쪼개기를 이용해 리팩터링 해 보기
    const zidx = () => {
        /* 이미 있는 메모들을 돌며 z-index를 모든 메모보다 최대치로 설정하기 */
        let result = 0;
        MemoProps.forEach(memo => {
            if(memo.zIndex > result) result = memo.zIndex + 1
        })
        return result;
    }

    const createdDate = () => {
        /* 오늘 날짜를 구해서 Date값을 형식에 맞춰 만들기 */
        let now = new Date();
        return `${(now.getMonth() < 10)? '0'+(now.getMonth()+1): now.getMonth()+1}월 ${(now.getDate() < 10) ? '0'+now.getDate(): now.getDate()}일`
    }

    const newMemoHandler = () => {

        /* 새 메모 객체를 생성 */
        const newMemoObj = { 
            writer: localStorage.getItem('userId'),
            memoCategory : MemoCategory,
            height: '250px', width: '250px',
            x: 30, y: 30, 
            bgColor: '#b6f2cb',
            memoContext: '새 메모', 
            memoLocked: false, memoImport: false, memoTrash: false,
            zIndex: zidx(), createDate: createdDate()}

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

    const logoutHandler = () => {
        let userId = localStorage.getItem('userId');
        Axios.post('/api/logout', {_id : userId})
            .then(res => {
                if(res.data.logoutSuccess) { 
                    localStorage.removeItem('userId');
                    history.push('/');
                } else {
                    console.log(`${userId}의 로그아웃에 실패하였습니다.`)
                }
            })        
    }

    const positionChangeHandle = (locX, locY, memoId) => {
        
        let idx = indexFinder(memoId)
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

    const sizeChangeHandle = (x, y, w, h, memoId) => {

        let idx = indexFinder(memoId)
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

    const memoContextHandler = (e, memoId) => {
        let idx = indexFinder(memoId)
        MemoProps[idx].memoContext = e.currentTarget.value;
    }

    const saveMemoContext = (e, memoId) => {
        Axios.post('/api/rewriteMemo', 
                    { memoId: memoId, 
                      memoContext: MemoProps[indexFinder(memoId)].memoContext })
            .then(res => {
                if(res.data.rewriteSuccess) console.log("DB에 메모 내용 저장 성공")
            })
        setMemoProps(prevMemoProps => [...MemoProps]);
    }

    const indexFinder = (memoId) => {
        return MemoProps.findIndex(memo => memo._id === memoId);
    }

    return (
        <div>
            <NavBar 
             nowCategory={categoryHandler}
             newMemoHandler={newMemoHandler}
             logoutHandler={logoutHandler}
            />
            <div style = {{ height: '85vh'}}>
            { LogoutPage ? <LogoutMain/>
            : AnalysisPage ? <AnalysisMain memoProps={MemoProps} />
            : <MemoMain 
                memoCategory={MemoCategory} 
                memoProps={MemoProps}
                memoPropChange={memoPropChangeHandler}  
                memoContextHandler={memoContextHandler}                  
                saveMemoContext={saveMemoContext}
                positionChangeHandle = {positionChangeHandle}
                sizeChangeHandle = {sizeChangeHandle}
               /> }
            </div>
        </div>
    )
}

export default MemoPage
