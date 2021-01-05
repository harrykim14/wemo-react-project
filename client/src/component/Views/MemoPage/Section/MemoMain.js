import React, { useState } from 'react'
import { Rnd } from 'react-rnd';
import DeleteIcon from '@material-ui/icons/Delete';
import PaletteIcon from '@material-ui/icons/Palette';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import './MemoMain.css';

function MemoMain(props) { 
    const [PaletteModal, setPaletteModal] = useState(false)
    const [ModalProps, setModalProps] = useState({x : 0, y: 0, memoNum: null})

    /* 메모 상단 아이콘 이벤트 핸들러: memoNum과 클릭한 아이콘의 클래스명을 부모객체로 넘겨줌 */
    const memoMenuHandler = (e) => {
        let memoId = e.currentTarget.getAttribute('value');
        let iconClassName = e.currentTarget.getAttribute('class').split(' ')[1];
        props.memoPropChange({_id: memoId, icon:iconClassName});
    }

    /* 팔레트 모달창을 열고 닫기, 팔레트 아이콘으로도 x버튼으로도 닫을 수 있게 함 */
    const paletteDisplayHandler = (e) => {

        if(PaletteModal) {
            setPaletteModal(false);
            return false
        }

        let memoId = e.currentTarget.getAttribute('value');
        setModalProps({x: e.clientX-100, y: e.clientY+20, _id:memoId})
        setPaletteModal(!PaletteModal)
    }

    /* 팔레트 모달창에서 색깔을 클릭하면 해당 색깔을 rgb에서 hex코드로 변경, 부모객체로 메모 번호와 색깔을 전달 */
    const changeMemoBgColorHandler = (e) => {
        let getDivStyle = e.currentTarget.getAttribute('style').split(':');
        let thisColor = getDivStyle[getDivStyle.length-1].replace( /[^%,.\d]/g, "" ).split(',').map(num => parseInt(num,10).toString(16)).join('')
        setPaletteModal(!PaletteModal)
        props.memoPropChange({_id: ModalProps._id, icon:"Palette", bgColor: `#${thisColor}`});
    }
    
    /* 부모 객체에서 변경되면 다시 memoProps 배열을 받아 map함수로 렌더 */
    const memoRender = (memoProps) => {
        console.log("memoRender()중 카테고리:", props.memoCategory)
        return memoProps.map((item, idx) => (
        <Rnd
         key={idx}
         className = "MemoBox"
         style ={{ backgroundColor: item.bgColor, zIndex: item.zIndex}}
         size={{ width: item.width,  height: item.height, }}
         minHeight={200} minWidth={200} maxHeight={999} maxWidth={999}
         position={{ x: (item.x <0) ? 0 : item.x, y: (item.y < 60) ? 60 : item.y }}
         onDragStop ={ (e, d) => { 
            if(e.target.getAttribute('d')) return e.preventDefault();
            // drag하는 대상이 textarea일 경우(text가 어떤식으로든 있는 객체일 경우 string 값이 e.target.value로 들어옴) 이벤트를 취소
            // 혹은 메모 저장 버튼(받아오는 class가 MuiButton-label)일 경우에도 이벤트를 취소
            props.PositionChangeHandle(d.x, d.y, item._id) }}
         onResizeStop={(e, d, ref, delta, position) => {
            props.SizeChangeHandle(position.x, position.y, ref.style.width, ref.style.height, item._id)             
         }}>  
            <span>{item.createDate}</span>
            <span style={{float:'right'}}>
            
            {item.memoImport ?
            <StarIcon value = {item._id} className = "Star" onClick = {memoMenuHandler} /> :
            <StarBorderIcon value = {item._id} className = "StarBorder" onClick = {memoMenuHandler} />}

            {item.memoLocked ? 
            <LockIcon value = {item._id} className = "Lock" onClick = {memoMenuHandler} /> :
            <LockOpenIcon value = {item._id} className = "LockOpen" onClick = {memoMenuHandler} />}

            <PaletteIcon value = {item._id} className = "Palette" onClick ={paletteDisplayHandler} />
                     
            <DeleteIcon value = {item._id} className = "Delete" onClick = {memoMenuHandler} />
            </span><br/>
                 
            <textarea defaultValue={item.memoContext} 
                      onChange={(e) => { props.memoContextHandler(e, item._id) }} />
            <Button className="MemoSaveButton"
                    onClick={(e) => { props.saveMemoContext(e, item._id) }}>
                메모 저장
            </Button>
         </Rnd> 
        ))}

    return (
        <>
            {memoRender(props.memoProps)}
            {PaletteModal && 
                 <div className = "PaletteModal" 
                 style ={{ top: ModalProps.y, left: ModalProps.x }}>
                    <div style={{ display: 'flex', flexWrap:'wrap', justifyContent:'center'}}>
                    &nbsp;&nbsp;&nbsp;&nbsp;메모 배경색 선택하기
                    <CloseIcon
                        title="닫기"
                        style ={{ float:'right'}}
                        onClick={paletteDisplayHandler}
                    />                     
                    <br/>
                    {['#B6F2CB','#C3F2B6','#EBF2B6','#F2D7B6','#F2B6B6'].map((bgColor, idx) => (
                        <div key={idx} 
                        onClick={changeMemoBgColorHandler}
                        style = {{ display:'block', width: '35px',  height: '35px', margin: '2px 4px 2px 2px', backgroundColor: bgColor}}></div>
                    ))}
                    </div>
                 </div>
            }
        </>
        )
}

export default MemoMain
