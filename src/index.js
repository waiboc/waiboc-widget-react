/*
*
*/
import { CustomReply       }                               from "./js/componentes/CustomReply" ;
import { WaibocReactWidget }                               from "./waiboc-react-widget"        ;
import { api }                                             from "./js/api/api" ;
//
const { getChatbotInfo, getIdConversation, PARAMETROS } = api({backEndServer: false}) ;
//
export {
    CustomReply ,
    WaibocReactWidget ,
    getChatbotInfo ,
    getIdConversation ,
    PARAMETROS
} ;
//