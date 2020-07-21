import React, {useState, useEffect, useCallback} from 'react';
import logo from '../pic/logo512.png';
import './index.css';

const randomNum = Math.floor(Math.random() * 16)
function Slide(props) {
    const [img_1, setImg] = useState(logo);
    const [offset, setOffset] = useState([0, 0])
    const [currX, setCurrX] = useState(0)
    const [startX, setStartX] = useState()
    const drawImg = id => {
        const canvasImg = document.getElementById(id);
        const img_data = document.getElementById('img_data')
        img_data.src = img_1;
        img_data.alt = '';
        const ctx = canvasImg.getContext("2d");
        if(id === 'canvas_pane') {
            createClipPath(ctx, 100, randomNum)
        }
        canvasImg.width = img_data.naturalWidth;
        canvasImg.height = img_data.naturalHeight;
        ctx.drawImage(img_data, 0, 0);
    };
    const renderImage = useCallback(()=>{
        // 创建一个图片对象，主要用于canvas.context.drawImage()
        const objImage = new Image()

        objImage.addEventListener("load", () => {
            const [ imageWidth, imageHeight, fragmentSize ]= [512, 512, 100]

            const ctxFragment = document.getElementById('canvas_block').getContext("2d")
            const ctxShadow = document.getElementById('canvas_shadow').getContext("2d")

            createClipPath(ctxShadow, fragmentSize)
            createClipPath(ctxFragment, fragmentSize)

            // 生成裁剪图片坐标
            const clipX = Math.floor(fragmentSize + (imageWidth - 2 * fragmentSize) * Math.random())
            const clipY = Math.floor((imageHeight - fragmentSize) * Math.random())

            // 制出裁剪部分
            ctxFragment.drawImage(objImage, clipX, clipY, fragmentSize, fragmentSize, currX, 0, fragmentSize, fragmentSize)
            ctxShadow.drawImage(objImage, clipX, clipY, fragmentSize, fragmentSize, currX, 0, fragmentSize, fragmentSize)

            ctxShadow.fillStyle = "rgba(0, 0, 0, 0.5)"
            ctxShadow.fill()

            // 恢复画布状态
            ctxShadow.restore()
            ctxFragment.restore()

            // 设置裁剪小块的位置
            setOffset([clipX, clipY])
        })

        objImage.src = img_1;
        console.log(objImage.height)
    }, [currX])
    useEffect(() => {
        drawImg('canvas_pane');
        // drawImg('canvas_shadow');
        renderImage()
    }, [img_1]);
    // 生成裁剪路径
    const createClipPath = useCallback((ctx, size = 100) =>{

        const r = 0.1 * size
        ctx.save()
        ctx.beginPath()
        // left
        ctx.moveTo(r, r)
        ctx.lineTo(r, size - r)
        // bottom
        ctx.lineTo(size - r, size - r)
        // right
        ctx.lineTo(size - r, r)
        // top
        ctx.lineTo(r, r)

        ctx.clip()
        ctx.closePath()
    }, []);
    const onMouseMove = e => {
        if(typeof startX === "number") {
            setCurrX(e.clientX-startX)
        }
    }
    const onMoveStart = e => {
        setStartX(e.clientX)
    }
    const onMoveEnd = e => {
        if(offset[0] === currX) {
            alert('match')
        }else alert('not match')
        setCurrX(0)
        setStartX()
    }
    return (
        <div className="slide">
            <canvas id="canvas_block" className="canvas" style={{ top: offset[1], left: currX, zIndex: 999 }} />
            <canvas id="canvas_pane" className="canvas" />
            <canvas id="canvas_shadow" className="canvas" style={{ opacity: 0.3, top: offset[1], left: offset[0] }} />
            <img id="img_data" style={{ display: 'none' }} />
            <div id="slide-bar" className="slide-bar" onMouseMove={onMouseMove} >
                <button id="slide-button" onMouseDown={onMoveStart} onMouseOut={onMoveEnd} onMouseUp={onMoveEnd} style={{ position: 'absolute', left: currX }}> >>>>>>> </button>
            </div>
        </div>
    );
}



export default Slide;
