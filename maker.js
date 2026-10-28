export function Maker(){
	const $=this 
	let currentOwner
	$.own=newOwner=>currentOwner=newOwner
	$.createNew=(params)=>{
		currentOwner.innerHTML=""
		$.create(params)
	}
	$.clear=_=>{
		currentOwner.innerHTML=""
	}
	$.create=(params)=>{
		if(Array.isArray(params)){
			const arrOwner=currentOwner
			params.forEach(row=>{
				$.own(arrOwner)
				$.create(row)
			})
			return
		}
		let {tagName="div"}=params
		const {owner,id,cl,text,html,data,width,height,transform}=params
		const {input,select}=params
		const {style,draggable,contentEditable}=params
		const {onmouseup,onkeyup,onkeydown,oninput,onchange}=params
		if(owner)$.own(owner)
		if(input)tagName="input"
		if(select)tagName="select"
		const div=document.createElement(tagName)
		if(input){
			const{type="text",value="",accept}=input
			div.type=type
			if(type==="checkbox")div.checked=value
			if(type==="text")div.value=value
			if(type==="file"){
				if(accept)div.accept=accept
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
		if(style)div.style=style // override css
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
		currentOwner.appendChild(div)
		if(Object.hasOwn(params,"subs")){
			params.subs.forEach(sub=>{
				$.own(div)
				$.create(sub)
			})
		}
		if(contentEditable)div.contentEditable=true
		return div
	}
}
