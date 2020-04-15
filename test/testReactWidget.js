//
import React                       from "react"     ;
import ReactDOM                    from "react-dom" ;
//import {WaibocReactWidget}           from "../lib/index" ;
import {WaibocReactWidget}           from "../src/index" ;
//
console.log('...WaibocReactWidget: ',WaibocReactWidget) ;
//
/*
*
*/
ReactDOM.render(
            <WaibocReactWidget idAgent="5e944932a6f5c53ad8bac8b3"
                    options={false}
                    backEndServer={"http://localhost:3001"}
                    onWindowOpen={
                            ()=>{
                                    console.log('...abro chat pot primera vezzz') ;
                            }
                    }
                    //secret="a132ac59-5556-48d7-97d3-a1a21cade65d"
            />,
            document.getElementById('root')
        ) ;
//