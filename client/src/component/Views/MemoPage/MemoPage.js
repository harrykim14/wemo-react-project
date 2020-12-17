import React, { useState, useEffect } from 'react'
import Header from '../Header/Header';
import MemoMain from './Section/MemoMain';

function MemoPage() {

    let exampleMemo = [
        { height: '250px', width: '250px', x: 30, y: 30, bgColor: '#F2D7B6', memoNum : 0, memoContext: 'MemoContext', memoLocked: false, memoImport: true, zIndex: 50},
        { height: '250px', width: '250px', x: 300, y: 30, bgColor: '#EBF2B6', memoNum : 1, memoContext: 'MemoContext', memoLocked: true, memoImport: false, zIndex: 51},
    ]
    const [MemoCategory, setMemoCategory] = useState('');
    const [MemoProps, setMemoProps] = useState([]);

    useEffect(() => {
        setMemoProps(exampleMemo);
        // eslint-disable-next-line
    }, [])

    const categoryHandler = (categoryName) => {
        setMemoCategory(categoryName);
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

    const PositionChangeHandle = (locX, locY, memoNum) => {
        exampleMemo[memoNum].x = locX;
        exampleMemo[memoNum].y = locY;
        setMemoProps(exampleMemo);
    }

    const SizeChangeHandle = (x, y, w, h, memoNum) => {
        console.log("memoWidth:", w, " memoHeight:", h)
        exampleMemo[memoNum].x = x;
        exampleMemo[memoNum].y = y;
        exampleMemo[memoNum].width = w;
        exampleMemo[memoNum].height = h;
        setMemoProps(exampleMemo);
    }

    return (
        <div>
            <Header nowCategory={categoryHandler}/>
            <div style = {{ height: '82vh'}}>
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
