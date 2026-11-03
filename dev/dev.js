import {Maker} from '../maker.js'
import { CanvasHandler } from '../maker.js'
new App(new AppConfig,new Maker,new CanvasHandler).init()

function AppConfig(){
  const $=this
  $.appName="Qinoniq"
  $.copyright="© 2026 Per Adamsson"
}

function App(config,maker,canvasHandler){
  const{clear,create,createNew,own,showDialog}=maker
  const{setCanvas,initHover,drawGrids,addHoverGrid,addHoverCross}=canvasHandler
  const{appName,copyright}=config
  const $=this
  $.init=async _=>{
    create(`boilerplate ${appName} '${copyright}'`)
    btnPanel1Handler.render(create({owner:main,id:"btnPanel1",cl:"panel"}))
    // own(main)
    // create({
    //   id:"drawArea",
    //   bg:"#fff",
    //   multiCanvas:{ids:["cvBase","cvGrids","cvSelect","cvHover"],translate:false},
    // })
    // const grids=Array.from({length:10},()=> Array(10).fill(null))
    // setCanvas(cvGrids)
    // drawGrids({grids,fg:"#ddd"})
    // setCanvas(cvHover)
    // initHover()
  }
  const btnPanel1Handler={
    render:owner=>{
      const buttonScheme=[
        {text:"Show regular dialog",data:{dialogName:"regular"}},
        {text:"Show canvas dialog",data:{dialogName:"canvas"}},
      ]
      buttonScheme.forEach(btn=>btn.onmouseup=btnPanel1Handler.showDialog)
      buttonScheme.forEach(btn=>btn.owner=owner)
      buttonScheme.forEach(btn=>btn.cl="btn")
      buttonScheme.forEach(create)
    },
    showDialog:async e=>{
      const dialogName=e.currentTarget.dataset.dialogName
      const res=await showDialog(btnPanel1Handler.dialogs[dialogName]())
      console.log(res.clickedButton)
      console.log(res.inputData)
    },
    dialogs:{
      regular:_=>{
        return{
          rows:[
            {text:"Test"},
            {height:25},
            {caption:"text 1",input:{},id:"inp1"},
            {caption:"text 2",input:{},id:"inp2"},
            {caption:"range 1",input:{type:"range",settings:[5,2,12]},id:"range1"},
            {caption:"select 1",select:{options:["a","b","c"]},id:"sel1"},
          ],
          btns:{ok:_=>maker.closeDialog()},
        }
      }, 
      canvas:_=>{
        return{
          rows:[
            {
              id:"drawArea",
              bg:"#fff",
              multiCanvas:{ids:["cvBase","cvGrids","cvSelect","cvHover"],translate:false},
            }
          ],
          btns:{done:_=>maker.closeDialog()},
          afterSpawn:_=>{
            const grids=Array.from({length:10},()=> Array(10).fill(null))
            setCanvas(cvGrids)
            drawGrids({grids,fg:"#ddd"})
            setCanvas(cvHover)
            initHover()
          },
        }
      },
    },
  }
}