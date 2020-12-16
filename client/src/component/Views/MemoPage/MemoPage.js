import React, { useState, useEffect } from 'react'
import Header from '../Header/Header';
import MemoMain from './Section/MemoMain';

function MemoPage() {

    let exampleMemo = [
        { height: '200px', width: '200px', x: 30, y: 30, backgroundColor: 'lightgray', memoNum : 0, memoContext: 'MemoContext'}
    ]
    const [MemoCategory, setMemoCategory] = useState('');
    const [MemoProps, setMemoProps] = useState([]);

    useEffect(() => {
        setMemoProps(exampleMemo);
    }, [])

    const categoryHandler = (categoryName) => {
        setMemoCategory(categoryName);
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
            <div style = {{ height: '50vh'}}>
            <MemoMain 
                memoCategory={MemoCategory} 
                memoProps={MemoProps}
                PositionChangeHandle = {PositionChangeHandle}
                SizeChangeHandle = {SizeChangeHandle}
            />
            </div>
        </div>
    )
}

export default MemoPage
