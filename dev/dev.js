import {Maker} from '../maker.js'
import {CanvasHandler} from '../maker.js'
import {DialogHandler} from '../maker.js'
new App().init()

function AppConfig(){
  const $=this
  $.appName="Qinoniq"
  $.copyright="© 2026 Per Adamsson"
}

function App(){
  const maker=new Maker
  const{appName,copyright}=new AppConfig
  const{clear,create,createNew,own}=maker
  const{
    initCanvasHandler,
    setCurrentCanvas,
    drawGrids,
    drawEdits,
    addEdit,
    ripEdit,
    clearEditCanvas,
  }=new CanvasHandler
    const{showDialog,closeDialog}=new DialogHandler(maker)
  const $=this
  $.init=async _=>{
    create(`boilerplate ${appName} '${copyright}'`)
    btnPanel1Handler.render(create({owner:main,id:"btnPanel1",cl:"panel"}))
  }
  const btnPanel1Handler={
    render:owner=>{
      const buttonScheme=[
        {text:"Show regular dialog",data:{dialogName:"regular"}},
        {text:"Show canvas dialog gridhover",data:{dialogName:"canvas",hoverType:"grid"}},
        {text:"Show canvas dialog crosshover",data:{dialogName:"canvas",hoverType:"cross"}},
      ]
      buttonScheme.forEach(btn=>btn.onmouseup=btnPanel1Handler.showDialog)
      buttonScheme.forEach(btn=>btn.owner=owner)
      buttonScheme.forEach(btn=>btn.cl="btn")
      buttonScheme.forEach(create)
    },
    showDialog:async e=>{
      const dialogName=e.currentTarget.dataset.dialogName
      const hoverType=e.currentTarget.dataset.hoverType
      const res=await showDialog(btnPanel1Handler.dialogs[dialogName](hoverType))
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
          btns:{ok:_=>closeDialog()},
        }
      }, 
      canvas:hoverType=>{
        return{
          rows:[
            {
              id:"drawArea",
              bg:"#fff",
              multiCanvas:{ids:["cvGrid","cvEdit","cvSelect","cvHover"],translate:false},
            }
          ],
          btns:{
            done:_=>closeDialog(),
            clear:_=>clearEditCanvas(),
          },
          afterSpawn:_=>{
            initCanvasHandler({
              rowCount:15,
              colCount:15,
              hoverCanvas:cvHover,
              editCanvas:cvEdit,
              hoverType,
              onhover:params=>{
                console.log("hover: ",params)
              },
              onmouseup:params=>{
                params.bg="#000"
                if(params.button===0){
                  addEdit(params)
                }
                if(params.button===2){
                  ripEdit(params)
                }
              },
            })
            setCurrentCanvas(cvGrid)
            drawGrids({fg:"#ddd"})
            drawEdits()
          },
        }
      },
    },
  }
}