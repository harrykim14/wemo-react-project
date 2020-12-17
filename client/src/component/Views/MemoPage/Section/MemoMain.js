import React, { useState } from 'react'
import { Rnd } from 'react-rnd';
import DeleteIcon from '@material-ui/icons/Delete';
import PaletteIcon from '@material-ui/icons/Palette';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import CloseIcon from '@material-ui/icons/Close';
import './MemoMain.css';

function MemoMain(props) { 

    const [PaletteModal, setPaletteModal] = useState(false)
    const [ModalProps, setModalProps] = useState({x : 0, y: 0, memoNum: null})

    const memoMenuHandler = (e) => {
        let memoNum = e.currentTarget.getAttribute('value');
        let iconClassName = e.currentTarget.getAttribute('class').split(' ')[1];
        props.memoPropChange({memoNum: memoNum, icon:iconClassName});
        
    }

    const paletteDisplayHandler = (e) => {
        let memoNum = e.currentTarget.getAttribute('value');
        setPaletteModal(!PaletteModal)
        setModalProps({x: e.clientX-100, y: e.clientY+20, memoNum:memoNum})
    }

    const changeMemoBgColorHandler = (e) => {
        let getDivStyle = e.currentTarget.getAttribute('style').split(':');
        let thisColor = getDivStyle[getDivStyle.length-1].replace( /[^%,.\d]/g, "" ).split(',').map(num => parseInt(num,10).toString(16)).join('')
        setPaletteModal(!PaletteModal)
        props.memoPropChange({memoNum: ModalProps.memoNum, icon:"Palette", bgColor: `#${thisColor}`});
        
    }
    
    const memoRender = (memoProps) => (
        memoProps.map(item => (
        <Rnd
         key={item.memoNum}
         className = "MemoBox"
         style ={{ backgroundColor: item.bgColor, zIndex: item.zIndex}}
         size={{ width: item.width,  height: item.height }}
         position={{ x: item.x, y: item.y }}
         onDragStop ={ (e, d) => { 
             props.PositionChangeHandle(d.x, d.y, item.memoNum)
        }}
         onResizeStop={(e, d, ref, delta, position) => {
             props.SizeChangeHandle(position.x, position.y, ref.style.width, ref.style.height, item.memoNum)             
         }}>  
                 <span>Date</span>
                 <span style={{float:'right'}}>
                     {item.memoImport ?
                     <StarIcon 
                     value = {item.memoNum}
                     className = "Star"
                     onClick = {memoMenuHandler}
                     style ={{cursor:'pointer'}}/> :
                     <StarBorderIcon 
                     value = {item.memoNum}
                     className = "StarBorder"
                     onClick = {memoMenuHandler}
                     style ={{cursor:'pointer'}}/>}

                     {item.memoLocked ? 
                     <LockIcon
                     value = {item.memoNum}
                     className = "Lock"
                     onClick = {memoMenuHandler}
                     style ={{cursor:'pointer'}}/> :
                     <LockOpenIcon
                     value = {item.memoNum}
                     className = "LockOpen"
                     onClick = {memoMenuHandler}
                     style ={{cursor:'pointer'}}/>}

                     <PaletteIcon
                     value = {item.memoNum}
                     onClick ={paletteDisplayHandler}
                     style ={{cursor:'pointer'}}/>
                     <DeleteIcon
                     value = {item.memoNum}
                     className = "Delete"
                     onClick = {memoMenuHandler}
                     style ={{cursor:'pointer'}}/>
                 </span><br/>
                 
                 <textarea 
                 defaultValue="Context"
                 cols={29}
                 rows={14}
                 style ={{ border: '0px none white',backgroundColor:'transparent'}}
                 />
         </Rnd>
         
         )))

    return (
        <>
            {memoRender(props.memoProps)}
            {PaletteModal && 
                 <div className = "PaletteModal" 
                 style ={{ top: ModalProps.y, left: ModalProps.x }}>
                    <div style={{ display: 'flex', flexWrap:'wrap', justifyContent:'space-between'}}>
                    메모 배경색 선택하기
                    <CloseIcon style ={{ float: 'right'}}/>                     
                    <br/>
                    {['#B6F2CB','#C3F2B6','#EBF2B6','#F2D7B6','#F2B6B6'].map((bgColor, idx) => (
                        <div key={idx} 
                        onClick={changeMemoBgColorHandler}
                        style = {{width: '40px',  height: '40px', margin: '2px', backgroundColor: bgColor}}></div>
                    ))}
                    </div>
                 </div>
            }
        </>
        )
}

export default MemoMain
