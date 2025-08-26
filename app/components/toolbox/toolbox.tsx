'use client'
import Head from 'next/head'
import { useState, useEffect, useRef } from 'react';

type Object = {
	id: string,
	width: number,
	height: number,
	x: number,
	y: number,
	bg_color: string,
	border: number,
	text: string,
	focus: boolean,
}

export default function ToolBox() {
	const [textObjects, setTextObjects] = useState<Object>([]);
	const [shapeObjects, setShapebjects] = useState<Object>([]);
	const [currentFocused, setCurrentFocused] = useState<Object>(null);

	function AddTextObject() {
		setTextObjects(prev => [...prev, {
			id: "txt-obj-"+prev.length, 
			width: 200, 
			height: 200, 
			x: 500, 
			y: 500, 
			bg_color: 'bg-red-200',
			border: 0,
			text: "Text here",
			focus: true,
		}]);
	}

	function AddShapeObject() {
		setShapeObjects(prev => [...prev, {id: "shp-obj-"+prev.length, width: 200, height: 200,  text: "", focus: true}]);
	}

	function updateText(id: string, text: string) {
		setTextObjects(prev => prev.map(obj => (obj.id === id ? {...obj, text: text} : obj)));
	}

	useEffect(()=> {
		if (currentFocused == null) return;
		let currentObj = document.getElementById(currentFocused.id); 		
		console.log(currentObj);

		const handleMouseMove = ()=> {
			const onMouseUp = ()=> {
				document.removeEventListener('mousemove', onMouseMove);
				document.removeEventListener('mousedown', handleMouseMove);
				currentObj.focus = false;
			}

			const onMouseMove = (e: React.MouseEvent)=> {
		        let x = parseInt(window.getComputedStyle(currentObj).left);
		        let y = parseInt(window.getComputedStyle(currentObj).top);

		        currentObj.style.left = (x + e.movementX) + 'px';
		        currentObj.style.top = (y + e.movementY) + 'px';
			}

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
		};

		currentObj.addEventListener('mousedown', handleMouseMove);
		return ()=> (document.removeEventListener('mousedown', handleMouseMove));

	}, [currentFocused]);

	// function TextOnClick(e: React.MouseEvent<HTMLDivElement>) {
	function ObjectOnClick(obj: Object, e: React.MouseEvent) {
		e.preventDefault();
		setCurrentFocused(obj);
	}

	return (<>
		<div className="z-9999 absolute mx-2 shadow-xl p-5 rounded-md w-fit h-auto bg-white top-[35%]"> 
			<ul>
				{/*<li><i id='1' onClick={()=>{updateStatus(true, false, false)}} className="my-5 cursor-pointer m-2 text-2xl fa-solid fa-text"></i></li>*/}
				<li><i id='tbx-1' onClick={()=>{AddTextObject()}} className="my-5 cursor-pointer m-2 text-2xl fa-solid fa-text"></i></li>
				<li><i id='tbx-2' onClick={()=>{AddShapeObject()}} className="my-5 cursor-pointer m-2 text-2xl fa-solid fa-shapes"></i></li>
				<li><i id='tbx-3' onClick={()=>{alert('draw')}} className="my-5 cursor-pointer m-2 text-2xl fa-solid fa-pen"></i></li>
			</ul>
		</div>

		{ textObjects.map(obj => (
			<div 
				key={obj.id} 
				id={obj.id} 
				onClick={(e)=>{ObjectOnClick(obj, e)}}
				className={`absolute ${obj.bg_color}`}
				style={{
					border: obj.border + "px solid black",
					width: obj.width + "px",
					height: obj.width + "px",
					left: obj.x + "px",
					top: obj.y + "px",
				}}
			>

				<input 
					type='text'
					placeholder={obj.text} 
					value={obj.text}
					onChange={e => updateText(obj.id, e.target.value)}
					className='w-[100%] h-[100%] text-center'
					// style={{ pointerEvents: 'none', }}
				/>
			</div>
		)) }

		{ shapeObjects.map(obj => (
			<div key={obj.id} id={obj.id} className='p-5 absolute bg-red-200 left-[40%] top-[40%]'></div>
		)) }

	</>);
}