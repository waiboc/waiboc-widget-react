/*
*
*/
import React                                             from "react"         ;
import ls                                                from 'local-storage' ;
import { WidgetChatbot }                                 from "./js/componentes/WidgetChatbot" ;
import { api }                                           from "./js/api/api"  ;
//
const validateProps = ( props ) => {
    try {
        let flagValid = {
            validProps: true,
            error: []
        } ;
        //
        if ( typeof props.idAgent=="undefined" ){
            flagValid.error.push( "Props 'idAgent' is missing" ) ;
        } ;
        /*
        if ( typeof props.options=="undefined" ){
            flagValid.error.push( "Props 'options' is missing" ) ;
        } ;
        */
        //
        return flagValid ;
    } catch(errVP){
        console.log('....errVP: ',errVP) ;
    }
} ;
const chatbotInformation = (argOpt) => {
    return new Promise(function(respOk,respRech){
        try {
            //
            let newState = {} ;
            const { getChatbotInfo, getIdConversation, PARAMETROS } = api( {backEndServer: argOpt.backEndServer} ) ;
            getIdConversation(false, argOpt.options.training)
                    .then((respIdConversation)=>{
                        return getChatbotInfo( {idChatbot: argOpt.idAgent, idConversation: respIdConversation.id} ) ;
                    })
                    .then((respData)=>{
                        //
                        newState = {
                            flagCached: true,
                            flagValidBot: false,
                            idConversation: respData.result.idConversation || false,
                            chatlog: argOpt.showChatlog==true ? respData.result.chatlog : [] ,
                            chatEvents: respData.result.chatEvents || [],
                            options: argOpt.options || false
                        } ;
                        //
                        //console.log('....argOpt.showChatlog: ',argOpt.showChatlog,' chatlog: ',newState.chatlog) ;
                        //
                        if ( respData.result.resultCode==PARAMETROS.RESULT_CODES.OK ){
                            newState.flagValidBot    = true ;
                            newState.options = respData.result.options ? {...respData.result.options} : {...respData.result} ;
                            ls( PARAMETROS.SESSION.ID_CONVERSATION, respData.result.idConversation ) ;
                            //console.log('....voy a responder promiseeee:: newState: ',newState) ;
                            respOk( newState ) ;
                        } else {
                            console.log('....CHATBOT IS NOT VALID ---> ',respData.result.error) ;
                            newState = {flagCached: true, flagValidBot: false} ;
                            respOk( newState ) ;
                        }
                    })
                    .catch((respErr)=>{
                        console.dir(respErr) ;
                        newState = {flagCached: true, flagValidBot: false} ;
                        respOk( newState ) ;
                    }) ;
            //
        } catch(errCI){
            respRech(errCI) ;
        }
    }) ;
} ;
//
export class WaibocReactWidget extends React.Component {
    //
    constructor(props){
        super(props) ;
        this.state = {
            flagCached: false,
            flagValidBot: false,
            widgetVisible: true,
            idAgent: this.props.idAgent || false,
            showChatlog: (typeof this.props.showChatlog!="undefined") ? this.props.showChatlog : true,
            backEndServer: this.props.backEndServer ? this.props.backEndServer : false,
            idConversation: "",
            chatlog: [],
            chatEvents: [],
            launcher: (typeof this.props.launcher!="undefined") ? this.props.launcher : true,
            options: ( this.props.options && this.props.options!=false ) ? this.props.options : {}
        } ;
        this.retrieveData  = this.retrieveData.bind(this)  ;
        //
    } ;
    //
    static getDerivedStateFromProps(newProps,state){
        //
        if ( newProps.options && typeof newProps.options=="object" && JSON.stringify(newProps.options)!=JSON.stringify(state.options) || newProps.idAgent!=state.idAgent ){
            let newState = { idAgent: newProps.idAgent } ;
            if ( newProps.idAgent!=state.idAgent ){
                newState.chatlog    = [] ;
                newState.flagCached = false ;
                // ls.remove( PARAMETROS.SESSION.ID_CONVERSATION ) ;
            }
            if ( newProps.options!=false ){
                newState.options = newProps.options || {} ;
                if ( !newState.options.training  ){ newState.options.training=false; }
            }
            let resultValidation = validateProps( newProps );
            if ( resultValidation.validProps==true ){
                return newState ;
            } else {
                this.setState({ flagCached: true, flagValidBot: false }) ;
            }
        } else {
            return false ;
        }
        //
    } ;
    //
    async retrieveData(){
        let botInf = await chatbotInformation({showChatlog: this.state.showChatlog, idAgent: this.state.idAgent, backEndServer: this.state.backEndServer, options: this.state.options}) ;
        return botInf ;
    }
    //
    async componentDidUpdate(prevProps, prevState) {
        if (this.state.flagCached===false) {
            let botInf = await this.retrieveData() ;
            this.setState( botInf) ;
        }
      }
    //
    async componentDidMount(){
        try {
            let resultValidation = validateProps( this.props );
            if ( resultValidation.validProps==true ){
                let botInf = await this.retrieveData() ;
                this.setState( botInf) ;
            } else {
                console.log('...resultValidation: ',resultValidation) ;
                this.setState({ flagCached: true, flagValidBot: false }) ;
            }
        } catch(errDM){
            console.log('.....ERROR: ',errDM) ;
            this.setState({ flagCached: true, flagValidBot: false }) ;
        }
    }
    //
    render () {
        //
        let outRender = ( this.state.flagCached==true && this.state.flagValidBot==true )
                        ?   <WidgetChatbot
                                configuration={{
                                    idAgent: this.state.idAgent ,
                                    options: this.state.options
                                }}
                                key="22"
                                launcher={this.state.launcher}
                                widgetVisible={this.state.widgetVisible}
                                backEndServer={this.state.backEndServer}
                                onWindowOpen={this.props.onWindowOpen   ? this.props.onWindowOpen : ()=>{console.log('....windowOpen')}}
                                onWindowClose={this.props.onWindowClose ? this.props.onWindowClose : ()=>{console.log('....windowClose')}}
                                conversation={{
                                    idConversation: this.state.idConversation,
                                    chatlog: this.state.chatlog,
                                    chatEvents: this.state.chatEvents
                                }}
                            />
                        :   <div key="11" ></div> ;
        //
        return ( outRender ) ;
        //
    }
    //
}
//