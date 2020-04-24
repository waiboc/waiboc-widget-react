//
import React, { useState }         from "react"     ;
import ReactDOM                    from "react-dom" ;
//import {WaibocReactWidget}           from "../lib/index" ;
import {WaibocReactWidget}           from "../src/index" ;
//
console.log('...WaibocReactWidget: ',WaibocReactWidget) ;
//
const TestWidget = (props) => {
        //
        const [idBot,setIdBot] = useState("5e944932a6f5c53ad8bac8b3") ;
        const onClickB = (argEE) => {
                argEE.preventDefault() ;
                if ( idBot=="5e944932a6f5c53ad8bac8b3" ){
                        setIdBot("5ea0bb2ca1c4ff31101f2ac8") ;
                } else {
                        setIdBot("5e944932a6f5c53ad8bac8b3") ;
                }
        }
        //
        return(
                <div>
                        <h2>{idBot}</h2>
                        <button onClick={onClickB}
                        >
                                Switch
                        </button>
                        <WaibocReactWidget
                                //idAgent="5e944932a6f5c53ad8bac8b3"
                                //idAgent="5ea0bb2ca1c4ff31101f2ac8"
                                idAgent={idBot}
                                options={false}
                                launcher={false}
                                showChatlog={false}
                                backEndServer={"http://localhost:3001"}
                                onWindowOpen={
                                        ()=>{
                                                console.log('...abro chat pot primera vezzz') ;
                                        }
                                }
                                //secret="a132ac59-5556-48d7-97d3-a1a21cade65d"
                        />
                </div>
        )
} ;
/*
*
*/
ReactDOM.render( <TestWidget />, document.getElementById('root') ) ;
//