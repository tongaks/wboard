import { setUpObjects } from './setupObjects'

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

function GetObjects() {
	const {
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
		setCurrentFontColor
	} = setUpObjects();
}