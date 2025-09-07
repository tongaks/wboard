'use client'
import { useState, useEffect } from 'react';

type Object = {
	id: string,
	width: number,
	height: number,
	x: number,
	y: number,
	font_size: number,
	font_color: string,
	bg_color: string,
	border: number,
	text: string,
	focus: boolean,
	rotate: number,
	isRotating: boolean,
	z_index: number,
}

export default function ToolBox() {
	const [textObjects, setTextObjects] = useState<Object[]>([]);
	const [shapeObjects, setShapeObjects] = useState<Object[]>([]);
	const [currentFocused, setCurrentFocused] = useState<Object | null>(null);
	const [showObjEditDialog, setShowObjEditDialog] = useState(false);

	const [currentFontSize, setCurrentFontSize] = useState(0);
	const [currentBGColor, setCurrentBGColor] = useState('');
	const [currentFontColor, setCurrentFontColor] = useState('#000000');
	const [currentZIndex, setCurrentZIndex] = useState(0);

	const [mouseCoordinate, setMouseCoordinate] = useState({ x: 0, y: 0 });

	useEffect(()=>{
		const handleMousePosition = (e: MouseEvent) => {
			setMouseCoordinate({ x: e.clientX, y: e.clientY });
		}

		window.addEventListener('mousemove', handleMousePosition);
		return ()=>{window.removeEventListener('mousemove', handleMousePosition)};
	}, []);

	function AddTextObject() {
		setTextObjects(prev => [...prev, {
			id: "txt-obj-"+prev.length, 
			width: 200, 
			height: 200, 
			x: 500, 
			y: 500, 
			font_size: 16,
			font_color: '#000000',
			bg_color: '#ffcf39',
			border: 1,
			text: "Text here",
			focus: true,
			rotate: 0,
			isRotating: false,
			z_index: prev.length + 1,
		}]);

		setCurrentZIndex(textObjects.length + shapeObjects.length + 1);
	}

	function AddShapeObject() {
		setShapeObjects(prev => [...prev, {
			id: "shp-obj-"+prev.length, 
			width: 200, 
			height: 200, 
			x: 500, 
			y: 500, 
			font_size: 16,
			font_color: '#000000',
			bg_color: '#ffcf39',
			border: 1,
			text: "",
			focus: true,
			rotate: 0,
			isRotating: false,
			z_index: prev.length + 1,
		}]);

		setCurrentZIndex(textObjects.length + shapeObjects.length + 1);
	}

	function UpdateText(event: React.ChangeEvent<HTMLTextAreaElement>, id: string, text: string) {
		setTextObjects(prev => prev.map(obj => (obj.id === id ? {...obj, text: text} : obj)));
		event.target.style.height = 'auto';
	    event.target.style.height = event.target.scrollHeight + "px"; // grow to fit
	}

	// add event listener for moving an object
	useEffect(()=> {
		if (currentFocused == null) return;
		const currentObj = document.getElementById(currentFocused.id); 		
		if (currentObj == null) return;
		console.log(currentObj);

		// get the parent's rotate div
		// add event listener to it when clicked & hold 
		// remove listener accordingly

		const rotateDiv = currentObj.lastChild;

		const handleRotate = ()=> {
			currentObj.removeEventListener('mousedown', handleMouseMove);

		    const onMouseMove = (event: MouseEvent) => {
		        setShowObjEditDialog(showObjEditDialog && false);  // remove the edit dialog when obj is moved
		        currentFocused.isRotating = true;

			    const rotate_val_style = getComputedStyle(currentObj);
				const rotate_val = parseFloat(rotate_val_style.rotate) + event.movementY;
		       
		        currentObj.style.rotate = rotate_val + 'deg';
		        currentFocused.rotate = rotate_val;
		    }

		    const onMouseUp = ()=> {
		    	currentFocused.isRotating = false;
		        document.removeEventListener('mousemove', onMouseMove);
		        document.removeEventListener('mouseup', onMouseUp);
				currentObj.addEventListener('mousedown', handleMouseMove);	
		        // rotateDiv.removeEventListener('mousedown', handleRotate)
		    }

		    document.addEventListener('mousemove', onMouseMove);
		    document.addEventListener('mouseup', onMouseUp);
		}

		const handleMouseMove = ()=> {
			const onMouseMove = (e: MouseEvent)=> {
				setShowObjEditDialog(showObjEditDialog && (false));  // remove the edit dialog when obj is moved

				// if (currentObj == null) return;
		        const x = parseInt(window.getComputedStyle(currentObj).left);
		        const y = parseInt(window.getComputedStyle(currentObj).top);

		        currentObj.style.left = (x + e.movementX) + 'px';
		        currentObj.style.top = (y + e.movementY) + 'px';
		        currentObj.style.cursor = 'move'

		        currentFocused.x = x + e.movementX;
		        currentFocused.y = y + e.movementY;
			}

			const onMouseUp = ()=> {
				// if (currentObj == null) return;
		        currentObj.style.cursor = 'default'
				currentObj.removeEventListener('mousemove', onMouseMove);
				document.removeEventListener('mouseup', onMouseUp);
			}

			currentObj.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
		};

		currentObj.addEventListener('mousedown', handleMouseMove);
		if (rotateDiv != null) {
		    rotateDiv.addEventListener('mousedown', handleRotate);
		} else console.log("Object has no rotate div");

		return ()=> (currentObj.removeEventListener('mousedown', handleMouseMove));
	}, [currentFocused, showObjEditDialog]);


	function ObjectOnClick(obj: Object, e: React.MouseEvent) {
		e.preventDefault();
		setCurrentFocused(obj);
		setCurrentFontSize(obj.font_size);

		if (e.type == 'contextmenu' && showObjEditDialog == false) {
			setShowObjEditDialog(true);
		} else if (e.type == 'contextmenu' && showObjEditDialog) {
			setShowObjEditDialog(false);
		}
	}

	function ChangeBGColor(event: React.ChangeEvent<HTMLInputElement>) {
		setCurrentBGColor(event.target.value);
		if (currentFocused == null) return;
		currentFocused.bg_color = currentBGColor;
	}

	function ChangeFontColor(event: React.ChangeEvent<HTMLInputElement>) {
		setCurrentFontColor(event.target.value);
		if (currentFocused == null) return;
		currentFocused.font_color = currentFontColor;
	}

	function ChangeFontSize(event: React.ChangeEvent<HTMLInputElement>) {
		setCurrentFontSize(parseInt(event.target.value));
		if (currentFocused == null) return;
		currentFocused.font_size = currentFontSize;
	}

	// function ChangeFontSizeBtn(event: string) {
	function ChangeFontSizeBtn(event: React.MouseEvent<HTMLElement>) {
		if (event == null || event.target == null || currentFocused == null) return;
		// const event_target = event.target.id as HTMLElement;
		const btn = (event.target as HTMLElement).id;

		if (btn == "increase-btn") {
			currentFocused.font_size = currentFontSize + 1;
		} else if (btn == "decrease-btn" && currentFocused.font_size > 1) {
			currentFocused.font_size = currentFontSize - 1;
		}

		setCurrentFontSize(currentFocused.font_size);
	}

	useEffect(() => {
	    const handleKeyShortcuts = (e: KeyboardEvent) => {
	        if (e.repeat) return;

	        const keyPressed = e.key;

	        let currentObj = null;
	        if (currentFocused != null) {
				currentObj = document.getElementById(currentFocused.id); 		
	        } else console.log('currentFocused is null: ', currentFocused);

	        switch (keyPressed) {
	            case 'Escape':
	                setShowObjEditDialog(false);
	                setCurrentFocused(null);
	                if (document.activeElement instanceof HTMLElement) {
	                    document.activeElement.blur();
	                }
	                break;

	            case 'Delete':
	                if (currentFocused != null) {
	                    const current = document.getElementById(currentFocused.id);
	                    if (current != null) current.remove();
	                }
	                break;

	            case '[':
	                if (currentObj != null && currentFocused != null) {
	                	const newIndex = currentZIndex + 1;
	                	setCurrentZIndex(newIndex);
	                	currentObj.style.zIndex = '' + newIndex;
	                	currentFocused.z_index = newIndex;
	                } break;

	            case ']':
	                if (currentObj != null && currentFocused != null) {
	                	const newIndex = currentZIndex <= 2 ? 0 : currentZIndex - 1;
	                	setCurrentZIndex(newIndex);
	                	currentObj.style.zIndex = '' + newIndex;
	                	currentFocused.z_index = newIndex;
	                } break;
	        }
	    };

	    window.addEventListener('keydown', handleKeyShortcuts);
	    return () => window.removeEventListener('keydown', handleKeyShortcuts);

	}, [currentFocused]);


	return (<>
		<div className="z-9999 absolute mx-2 shadow-xl p-5 rounded-md w-fit h-auto bg-white top-[35%]"> 
			<ul>
				{/*<li><i id='1' onClick={()=>{updateStatus(true, false, false)}} className="my-5 cursor-pointer m-2 text-2xl fa-solid fa-text"></i></li>*/}
				<li><i id='tbx-1' onClick={()=>{AddTextObject()}} className="my-5 cursor-pointer m-2 text-2xl fa-solid fa-text"></i></li>
				<li><i id='tbx-2' onClick={()=>{AddShapeObject()}} className="my-5 cursor-pointer m-2 text-2xl fa-solid fa-shapes"></i></li>
				<li><i id='tbx-3' onClick={()=>{alert('draw')}} className="my-5 cursor-pointer m-2 text-2xl fa-solid fa-pen"></i></li>
			</ul>
		</div>

		{/* add the onclick functions or update for the edit properties */}
		{/* refer to edit-element_menu.js */}

		{showObjEditDialog && currentFocused && (
			<div
				className="z-[9999] absolute bg-white shadow-lg rounded-lg p-4 w-[250px]"
				style={{
					left: currentFocused.x + currentFocused.width + 20 + "px",
					top: currentFocused.y + "px",
				}}>

				<h2 className="text-lg font-semibold mb-3">Edit</h2>

				{/* Background Color Section */}
				<div className="mb-4">
					<h3 className="text-sm font-medium mb-2">BG color:</h3>
					<input value={currentFocused.bg_color} onChange={(e)=>{ChangeBGColor(e)}} type="color" 
						placeholder="Color" className="w-full h-8 border rounded mb-2"/>
					<div className="flex gap-2">
						<div className="w-6 h-6 rounded cursor-pointer bg-red-500"></div>
						<div className="w-6 h-6 rounded cursor-pointer bg-blue-500"></div>
						<div className="w-6 h-6 rounded cursor-pointer bg-green-500"></div>
					</div>
				</div>

				{/* Font Color Section */}
				<div className="mb-4">
					<h3 className="text-sm font-medium mb-2">Font color:</h3>
					<input 
						value={currentFocused.font_color}
						onChange={(e)=>{ChangeFontColor(e)}}
						type="color" 
						placeholder="Color" 
						className="w-full h-8 border rounded mb-2"
					/>
					<div className="flex gap-2">
						<div className="w-6 h-6 rounded cursor-pointer bg-red-500"></div>
						<div className="w-6 h-6 rounded cursor-pointer bg-blue-500"></div>
						<div className="w-6 h-6 rounded cursor-pointer bg-green-500"></div>
					</div>
				</div>

				{/* Font size Section */}
				<div>
					<h3 className='mb-2'>Font Size</h3>
					<div className='flex text-center justify-center content-center gap-2'>
						<i id='increase-btn' onClick={(e)=>{ChangeFontSizeBtn(e)}} className="cursor-pointer fa-solid fa-plus text-2xl"></i>
						<input 
							id="font-size-input"
							type="number"
							placeholder="Font size"
							className="p-2 w-full h-8 border rounded mb-2"
							value={currentFontSize}
							onChange={(e)=> {ChangeFontSize(e)}}
						/>
						<i id='decrease-btn' onClick={(e)=>{ChangeFontSizeBtn(e)}} className="cursor-pointer fa-solid fa-minus text-2xl"></i>
					</div>
				</div>
			</div>
		)}


		{ textObjects.map(obj => (
			<div 
				key={obj.id} 
				id={obj.id} 
				onClick={(e)=>{ObjectOnClick(obj, e)}}
				onContextMenu={(e)=>{ObjectOnClick(obj, e)}}
				className={`absolute justify-center content-center`}
				style={{
					backgroundColor: obj.bg_color, 
					border: obj.border + "px solid black",
					width: obj.width + "px",
					height: obj.width + "px",
					left: obj.x + "px",
					top: obj.y + "px",
					rotate: obj.rotate + 'deg',
					zIndex: obj.z_index,
				}}>

				<textarea 
					placeholder={obj.text} 
					value={obj.text}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {UpdateText(e, obj.id, e.target.value)}}
					rows={1}
					className='overflow-hidden resize-none text-center focus:outline-none focus:border-none select-none w-full h-auto'
					style={{
						fontSize: obj.font_size + 'px', 
						color: obj.font_color,
					}}
				></textarea>

				{ currentFocused && currentFocused.id == obj.id && (
					<div className="absolute w-[15px] h-[15px] cursor-move rounded-xl bg-black select-none" 
						style={{ left: (obj.width / 2) - 10 + 'px', top: obj.height + 10 + 'px', }}>
					</div>
				)}

			</div>
		)) }



		{ currentFocused && currentFocused.isRotating && (
			<div className="z-9999 absolute p-2 bg-black text-white rounded-lg" style={{ left: mouseCoordinate.x + 20, top: mouseCoordinate.y + 20}}>
				<p>{currentFocused.rotate + 'deg'}</p>
			</div>
		)}



		{ shapeObjects.map(obj => (
			<div 
				key={obj.id} 
				id={obj.id} 
				onClick={(e)=>{ObjectOnClick(obj, e)}}
				onContextMenu={(e)=>{ObjectOnClick(obj, e)}}
				className='w-[200px] h-[200px] absolute bg-red-200 left-[40%] top-[40%]'
				style={{
					border: obj.border + 'px solid black',
					rotate: obj.rotate + 'deg',
					zIndex: obj.z_index,
				}}>

				{ currentFocused && currentFocused.id == obj.id && (
					<div className="absolute w-[15px] h-[15px] cursor-move rounded-xl bg-black select-none" 
						style={{ left: (obj.width / 2) - 10 + 'px', top: obj.height + 10 + 'px', }}>
					</div>
				)}
			</div>
		)) }

	</>);
}