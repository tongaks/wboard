import { useState } from 'react'

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
}

export function setUpObjects() {
	const [textObjects, setTextObjects] = useState<Object[]>([]);
	const [shapeObjects, setShapeObjects] = useState<Object[]>([]);
	const [currentFocused, setCurrentFocused] = useState<Object | null>(null);
	const [showObjEditDialog, setShowObjEditDialog] = useState(false);

	const [currentFontSize, setCurrentFontSize] = useState(0);
	const [currentBGColor, setCurrentBGColor] = useState('');
	const [currentFontColor, setCurrentFontColor] = useState('#000000');

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
		}]);
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
		}]);
	}

	return {
		textObjects,
		setTextObjects,
		shapeObjects,
		setShapeObjects,
		currentFocused,
		setCurrentFocused,
		showObjEditDialog,
		setShowObjEditDialog,
		currentFontSize,
		setCurrentFontSize,
		currentBGColor,
		setCurrentBGColor,
		currentFontColor,
		setCurrentFontColor,
		AddShapeObject,
		AddTextObject,
	};
}