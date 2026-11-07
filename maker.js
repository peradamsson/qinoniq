export function Maker(){
	const $=this 
	let currentOwner=document.body // Initial owner
	$.own=newOwner=>currentOwner=newOwner
	$.createNew=(params)=>{
		currentOwner.innerHTML=""
		$.create(params)
	}
	$.clear=_=>{
		currentOwner.innerHTML=""
	}
	$.createRow=params=>{
		params.flexDirection="row"
		$.create(params)
	}
	$.createCol=params=>{
		params.flexDirection="col"
		$.create(params)
	}
	$.create=(params)=>{
		if(typeof params==="string"&&params.startsWith("boilerplate")){
			const [_,headerText,footerText]=splitWithQuotes(params)
			currentOwner.style="display:flex;flex-direction:column;margin:0;padding:0;"
			$.create([
				{tagName:"header",id:"header",text:trimQuotes(headerText)},
				{tagName:"main",id:"main"},
				{tagName:"footer",id:"footer",text:trimQuotes(footerText)},
			])
			return //console.log("Boilerplate inserted...")
		}
		let {sh}=params
		if(typeof params==="string")sh=params
		if(Array.isArray(params)){
			const arrOwner=currentOwner
			params.forEach(row=>{
				$.own(arrOwner)
				$.create(row)
			})
			return
		}
		let  	{flexDirection="row",id,cl="",tagName="div"}=params // can be set via sh(shorthand)
		let		{width,height,fg,bg,text}=params // can be set via sh(shorthand)
		const {owner,html,data}=params
		const {transform}=params
		const {input,select,multiCanvas}=params
		const {style,draggable,contentEditable}=params
		const {onmouseup,onkeyup,onkeydown,oninput,onchange}=params
		const {caption}=params
		if(sh){ // shorthand string, example: "col <div> #id .class1 .class2 200x20 fg#f00 bg#fff $Text"
			const shArr=splitWithQuotes(sh)
			let arrClasses=[]
			shArr.forEach(shVal=>{
				if(shVal.startsWith("#"))id=shVal.substring(1) // if multiple, last will be used
				if(shVal.startsWith("."))arrClasses.push(shVal)
				if(isTwoIntsSeparatedByX(shVal))[width,height]=shVal.split("x");
				if(shVal.startsWith("fg"))fg=shVal.substring(2)
				if(shVal.startsWith("bg"))bg=shVal.substring(2)
				if(shVal.startsWith("'")&&shVal.endsWith("'"))text=shVal.substring(1,shVal.length-1)
				if(shVal==="row")flexDirection="row"
				if(shVal==="col")flexDirection="col"
				if(shVal.startsWith("<")&&shVal.endsWith(">"))tagName=shVal.substring(1,shVal.length-1)
			})
			arrClasses.forEach(newClass=>{ // add classes to cl
				if(cl.length>0)cl+=" "
				cl+=newClass.substring(1)
			})
		}
		if(owner)$.own(owner)
		if(!currentOwner){
			console.log("No current owner for:",params)
			return
		}
		if(input)tagName="input"
		if(select)tagName="select"
		const div=document.createElement(tagName)
		if(input){
			const{type="text",value="",accept,settings}=input
			div.type=type
			if(type==="checkbox")div.checked=value
			if(type==="text")div.value=value
			if(type==="file"){
				if(accept)div.accept=accept
			}
			if(type==="range"){
				if(Array.isArray(settings)&&settings.length>1){
					const[startValue,min,max]=settings
					div.value=startValue
					div.min=min
					div.max=max
				}
			}
		}
		if(select){
			const{value,options,disabled=false}=select
			let{values}=select
			if(!values)values=options.map(opt=>opt)
			options.forEach((option,i)=>{
				const value=values[i]
				const elOption=document.createElement("option")
				elOption.value=value
				elOption.textContent=option
				div.appendChild(elOption)
			})
			div.value=value
			if(disabled)div.disabled=true
		}
		if(style)div.style=style //Specific .style further down will override this...
		if(fg)div.style.color=fg
		if(bg)div.style.backgroundColor=bg
		if(id)div.id=id
		if(cl)cl.trim().split(" ").forEach(clName=>div.classList.add(clName))
		if(text)div.textContent=text
		if(html)div.innerHTML=html
		if(onmouseup)div.addEventListener("contextmenu",e=>e.preventDefault())
		if(onmouseup)div.addEventListener("mouseup",onmouseup)
		if(oninput)div.addEventListener("input",oninput)
		if(onkeyup)div.addEventListener("keyup",onkeyup)
		if(onkeydown)div.addEventListener("keydown",onkeydown)
		if(onchange)div.addEventListener("change",onchange)
		if(data)for(let key in data)div.dataset[key]=data[key]
		if(width!==undefined)div.style.width=width+"px"
		if(height!==undefined)div.style.height=height+"px"
		if(transform)div.style.transform=transform
		if(draggable)div.draggable=1
		div.style.display="flex"
		const parsedFlexDirecton=flexDirection==="col"?"column":flexDirection
		div.style.flexDirection=parsedFlexDirecton
		if(caption){
			const captionedDiv=getCaptionedDiv(div,caption,15)
			currentOwner.appendChild(captionedDiv)
		}else if(multiCanvas){
			const canvasWidth=multiCanvas?.width??width??200
			const canvasHeight=multiCanvas?.height??height??200
			multiCanvas.width=canvasWidth
			multiCanvas.height=canvasHeight
			multiCanvas.id=id??"multiCanvasId"
			const multiCanvasDiv=getMultiCanvasDiv(div,multiCanvas)
			currentOwner.appendChild(multiCanvasDiv)
		}else{
			try{
				currentOwner.appendChild(div)
			}catch(e){
				console.log(params)
			}
		}
		if(Object.hasOwn(params,"subs")){
			params.subs.forEach(sub=>{
				$.own(div)
				$.create(sub)
			})
		}
		if(contentEditable)div.contentEditable=true
		return div
	}
	const getCaptionedDiv=(div,caption,marginBottom)=>{
		const captionBox=document.createElement("div")
		captionBox.style=`display:flex;flex-direction:column;`
		const captionDiv=document.createElement("div")
		captionDiv.textContent=caption
		captionDiv.style="font-size:0.75rem;"
		const marginBottomDiv=document.createElement("div")
		marginBottomDiv.style=`margin-bottom:${marginBottom}px;`
		captionBox.append(captionDiv,div,marginBottomDiv)
		if(div.tagName==="INPUT"&&div.type==="range"){
			div.addEventListener("input",e=>{
				captionDiv.textContent=`${caption} ${e.currentTarget.value}`
			})
			div.dispatchEvent(new Event("input"))
		}
		return captionBox
	}	
	const getMultiCanvasDiv=(div,multiCanvas)=>{
		const{width,height,translate=true,ids}=multiCanvas
		div.style.width=width+"px"
		div.style.height=height+"px"
		ids.forEach(id=>{
			const cv=document.createElement("canvas")
			cv.id=id
			cv.width=width
			cv.height=height
			cv.style.width=width+"px"
			cv.style.height=height+"px"
			cv.style.position="absolute"
			div.style.position="relative"
			if(translate)cv.getContext("2d").translate(cv.width/2,cv.height/2)
			div.appendChild(cv)
		})
		return div
	}
	const isTwoIntsSeparatedByX=(str)=>{
		const parts = str.split("x")
		if (parts.length !== 2) return false
		const isIntString = s =>
		s.length > 0 &&
		[...s].every((ch, i) =>
			(ch >= "0" && ch <= "9") || (i === 0 && ch === "-")
		)
		return isIntString(parts[0]) && isIntString(parts[1])
	}
	const splitWithQuotes=(str)=>{
    const result=[]
    let current=''
    let inQuotes=false
    for (let i=0;i<str.length;i++){
			const char=str[i]
			if(char==="'"){
				inQuotes=!inQuotes
				current+=char
			}else if(char===' '&&!inQuotes){
				if(current){
					result.push(current)
				}
				current=''
			}else{
				current+=char
			}
    }
    if(current)result.push(current) // Last segment, if exists
    return result
	}
	const trimQuotes=(str)=>{
    let start=0
    let end=str.length
    if(str[0]==="'")start++
    if(str[end-1]==="'")end--
    return str.substring(start,end)
	}
}
export function DialogHandler(maker){
	const{own,create,createCol}=maker
	const $=this
	let id,clickedButton
	$.closeDialog=_=>{
		getDialog().style.display="none"
		getDialog().close(id)
	}
	$.showDialog=params=>{
		const{rows=[],btns={},afterSpawn}=params
		document.getElementById(id)?.remove()	
		id="dialogId_"+crypto.randomUUID()
		createCol({owner:document.body,id,tagName:"dialog"})
		rows.forEach(row=>{
			own(getDialog())
			create(row)
		})
		addButtons(btns)
		if(afterSpawn)afterSpawn()
		preventContextMenu()
		return new Promise((resolve)=>{
			getDialog().showModal()
			getDialog().addEventListener("close",e=>{
				const inputElements=getDialog().querySelectorAll(`INPUT,SELECT`)
				const inputData=[...inputElements].map(elm=>{
					const trimmed=elm.value?.trim()??''
					const num=parseFloat(trimmed)					
					return { // Return value as number if value is numeric
						id:elm.id,
						value:trimmed===''?'':(isNaN(num)?trimmed:num)
					}
				})
				resolve({id,inputData,clickedButton})
			},{once:true})
		})
	}
	const addButtons=btns=>{
		create({owner:getDialog(),id:"dialogButtons",cl:"flexRow"})
		own(dialogButtons)
		for(let key in btns){
			const btn=create({text:key,cl:"btn",onmouseup:btns[key]})
			btn.addEventListener("click",e=>{
				clickedButton=key
			})
		}
	}
	const preventContextMenu=_=>{
		getDialog().addEventListener("contextmenu",e=>e.preventDefault())
	}
	const getDialog=_=>document.getElementById(id)
}
export function CanvasHandler(){
	const $=this
	let rowCount,colCount,hoverCanvas,editCanvas,hoverType // are set in initCanvasHandler
	let currentCanvas,currentContext
	let lastX,lastY,gridH,gridW
	let editArr=[]
	$.setCurrentCanvas=cv=>setCurrent(cv)
	$.initCanvasHandler=params=>{
		({rowCount,colCount,hoverCanvas,editCanvas,hoverType}=params)
		const{onhover,onmouseup}=params
		const canvasDiv=hoverCanvas.parentElement 
		const canvases=canvasDiv.querySelectorAll(`canvas`)
		;[...canvases].forEach(cv=>{
			cv.style.pointerEvents=(cv===hoverCanvas)?"auto":"none"
		})
		gridH=hoverCanvas.height/rowCount 
		gridW=hoverCanvas.width/colCount
		// TODO Split setupEvent into one function per event...
		setupEvents(onhover,onmouseup)
	}
  const setupEvents=(onhover,onmouseup)=>{
		const mousemoveHandler=e=>{
			if(e.target!==hoverCanvas)return 
			const{x,y}=(_=>{
				const res={}
				if(hoverType==="grid"){
					res.x=parseInt(e.offsetX/gridW)
					res.y=parseInt(e.offsetY/gridH)
				}
				if(hoverType==="cross"){
					res.x=parseInt((e.offsetX+gridW/2)/gridW)
					res.y=parseInt((e.offsetY+gridH/2)/gridH)
				}
				return res
			})()
			if(x===lastX&&y===lastY)return
			lastX=x 
			lastY=y
			setCurrent(hoverCanvas)
			clearCanvas()
			if(hoverType==="grid")drawGrid({x,y,fg:"#f00"})
			if(hoverType==="cross")drawIntersection({x,y,bg:"#f00"})
			if(onhover)onhover({x,y})
			}
		document.body.removeEventListener("mousemove",mousemoveHandler)
		document.body.addEventListener("mousemove",mousemoveHandler)
		hoverCanvas.addEventListener("mouseup",e=>{
			if(!onmouseup)return
			const{button,shiftKey,ctrlKey,altKey}=e
			onmouseup({x:lastX,y:lastY,button,shiftKey,ctrlKey,altKey})
		})
		hoverCanvas.addEventListener("mouseleave",e=>{
			setCurrent(hoverCanvas)
			clearCanvas()
			lastX=undefined
			lastY=undefined
		})
	}
	const setCurrent=cv=>{
		currentCanvas=cv 
		currentContext=cv.getContext("2d")
	}
	$.setEditCanvas=cv=>editCanvas=cv
	$.initCanvasHandlerEvents=params=>{
		const{onhover,onmouseup}=params
	}
	$.drawGrids=params=>{
		const{fg="#000"}=params
		for(let y=0;y<rowCount;y++){
			for(let x=0;x<colCount;x++){
				drawGrid({x,y,fg})
			}
		}
	}
	$.drawEdits=cv=>{
		setCurrent(editCanvas)
		clearCanvas()
		if(hoverType==="grid")editArr.forEach(drawGrid)
		if(hoverType==="cross")editArr.forEach(drawIntersection)
		if(hoverType==="cross")drawVectors()
	}
	$.addEdit=params=>{
		const editIndex=getEditIndex(params)
		const editExists=editIndex>-1
		if( editExists)editArr[editIndex]=params
		if(!editExists)editArr.push(params)
		$.drawEdits()
	}
	$.ripEdit=params=>{
		const editIndex=getEditIndex(params)
		if(editIndex===-1)return
		editArr.splice(editIndex,1)
		$.drawEdits()
	}
	$.clearEditCanvas=_=>{
		setCurrent(editCanvas)
		clearCanvas()
		editArr=[]
	}
	const getEditIndex=params=>editArr.findIndex(ed=>ed.x===params.x&&ed.y===params.y)
	const clearCanvas=_=>currentContext.clearRect(0,0,currentCanvas.width,currentCanvas.height)
	const drawGrid=params=>{
		const{x,y,fg,bg}=params
		const ct=currentContext
		ct.beginPath()
		ct.rect(x*gridW,y*gridH,gridW,gridH)
		ct.strokeStyle=fg
		ct.fillStyle=bg
		if(fg)ct.stroke()
		if(bg)ct.fill()
		ct.closePath()
	}
	const drawIntersection=params=>{
		const{x,y,fg,bg}=params
		const ct=currentContext
		ct.beginPath()
		ct.arc(x*gridW,y*gridH,3,0,Math.PI*2)
		ct.strokeStyle=fg
		ct.fillStyle=bg
		if(fg)ct.stroke()
		if(bg)ct.fill()
		ct.closePath()
	}
	const drawVectors=_=>{
		for(let i=1;i<editArr.length;i++){
			const{x:x1,y:y1}=editArr[i-1]
			const{x:x2,y:y2}=editArr[i]
			const ct=currentContext
			const px1=x1*gridW,py1=y1*gridH
			const px2=x2*gridW,py2=y2*gridH
			const theta=Math.atan2(py2-py1,px2-px1)
			const headlen=8 // arrow wing length (px) 
			const angle=Math.PI/6 // arrow spread (~30°)
			ct.strokeStyle="#888"
			// Vector
			ct.beginPath()
			ct.moveTo(px1,py1)
			ct.lineTo(px2,py2)
			ct.stroke()
			// Arrow
			ct.beginPath()
			ct.moveTo(px2-headlen*Math.cos(theta-angle),py2-headlen*Math.sin(theta-angle))
			ct.lineTo(px2, py2)
			ct.lineTo(px2-headlen*Math.cos(theta+angle),py2-headlen*Math.sin(theta+angle))
			ct.stroke()
		}
	}
}