// TODO lift out dialog from maker
// TODO make sure body mousemove event doesn't duplicate

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
	$.showDialog=params=>{
		return dialog.show(params)
	}
	$.closeDialog=_=>{
		dialog.getDialog().style.display="none"
		dialog.getDialog().close(dialog.id)
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
	const dialog={
		id:null,
		clickedButton:null,
		show:params=>{
			const{rows=[],btns={},afterSpawn}=params
			document.getElementById(dialog.id)?.remove()	
			dialog.id="dialogId_"+crypto.randomUUID()
			$.createCol({owner:document.body,id:dialog.id,tagName:"dialog"})
			rows.forEach(row=>{
				$.own(dialog.getDialog())
				$.create(row)
			})
			dialog.addButtons(btns)
			if(afterSpawn)afterSpawn()
			dialog.preventContextMenu()
			return new Promise((resolve)=>{
				dialog.getDialog().showModal()
				dialog.getDialog().addEventListener("close",e=>{
					const inputElements=dialog.getDialog().querySelectorAll(`INPUT,SELECT`)
					const inputData=[...inputElements].map(elm=>{
						const trimmed=elm.value?.trim()??''
						const num=parseFloat(trimmed)					
						return { // Return value as number if value is numeric
							id:elm.id,
							value:trimmed===''?'':(isNaN(num)?trimmed:num)
						}
					})
					resolve({
						clickedButton:dialog.clickedButton,
						inputData,
					})
				},{once:true})
			})
		},
		addButtons:btns=>{
			$.create({owner:dialog.getDialog(),id:"dialogButtons",cl:"flexRow"})
			$.own(dialogButtons)
			for(let key in btns){
				const btn=$.create({text:key,cl:"btn",onmouseup:btns[key]})
				btn.addEventListener("click",e=>{
					dialog.clickedButton=key
				})
			}
		},
		preventContextMenu:_=>{
			dialog.getDialog().addEventListener("contextmenu",e=>e.preventDefault())
		},
		getDialog:_=>document.getElementById(dialog.id),
	}
}
export function CanvasHandler(){
	const $=this
	let ct,cv
	let rowCount,colCount,cellH,cellW
	$.initHover=_=>{
		const hoverId=cv.id
		document.body.addEventListener("mousemove",e=>{
			if(e.target.id!==hoverId)return 
			const x=parseInt(e.offsetX/cellW)
			const y=parseInt(e.offsetY/cellH)
			clearCanvas()
			// if(x<0||y<0||x>colCount-1||y>rowCount-1)return 
			drawAGrid({x,y,fg:"#f00"})
		})
		cv.addEventListener("mouseleave",e=>{
			clearCanvas()
		})
	}
	$.setCanvas=newCv=>{
		cv=newCv
		ct=cv.getContext("2d")
	}
	$.drawGrids=params=>{
		const{grids,fg="#000"}=params
		rowCount=grids.length
		colCount=grids[0].length
		cellH=cv.height/rowCount 
		cellW=cv.width/colCount
		for(let y=0;y<rowCount;y++){
			for(let x=0;x<colCount;x++){
				drawAGrid({x,y,fg})
			}
		}
	}
	$.addHoverGrid=params=>{
		
	}
	$.addHoverCross=params=>{

	}
	const clearCanvas=_=>ct.clearRect(0,0,cv.width,cv.height)
	const drawAGrid=params=>{
		const{x,y,fg}=params
		ct.beginPath()
		ct.rect(x*cellW,y*cellH,cellW,cellH)
		ct.strokeStyle=fg
		ct.stroke()
		ct.closePath()
	}
}