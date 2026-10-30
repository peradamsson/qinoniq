import {Maker} from '../maker.js'
new App(new Maker).init()

function App(maker){
  const{clear,create,createNew,own}=maker
  const $=this
  $.init=async _=>{
    const res=await maker.showDialog({
      rows:[
        {text:"Test"},
        {height:25},
        {caption:"text 1",input:{},id:"inp1"},
        {caption:"text 2",input:{},id:"inp2"},
        {caption:"range 1",input:{type:"range",settings:[5,2,12]},id:"range1"},
        {caption:"select 1",select:{options:["a","b","c"]},id:"sel1"},
      ],
      btns:{ok:_=>maker.closeDialog()},
    })
    console.log(res.clickedButton)
    console.log(res.inputData)
  }


}