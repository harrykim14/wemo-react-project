import React from 'react'
import { Rnd } from 'react-rnd';



function MemoMain(props) { 

    const memoRender = (memoProps) => (
        memoProps.map(item => (
        <Rnd
         key={item.memoNum}
         style ={{ backgroundColor: 'gray', 
                   padding: '10px', 
                   border: '1px solid black', 
                   boxShadow: '3px 3px #888888'}}
         size={{ width: item.width,  height: item.height }}
         position={{ x: item.x, y: item.y }}
         onDragStop ={ (e, d) => { 
             props.PositionChangeHandle(d.x, d.y, item.memoNum)
        }}
         onResizeStop={(e, d, ref, delta, position) => {
             props.SizeChangeHandle(position.x, position.y, ref.style.width, ref.style.height, item.memoNum)             
         }}>  
                 {item.memoContext}
         </Rnd>
         )))

    return (
        <>
            {memoRender(props.memoProps)}
        </>
        )
}

export default MemoMain
