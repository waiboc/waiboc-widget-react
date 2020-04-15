/*
*
*/
import React                                             from "react"         ;
import ls                                                from 'local-storage' ;
import { WidgetChatbot }                                 from "./js/componentes/WidgetChatbot" ;
import { api }                                           from "./js/api/api" ;
// import { getChatbotInfo, getIdConversation, PARAMETROS } from "./js/api/api" ;
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
//
// export { CustomReply } ;
export class WaibocReactWidget extends React.Component {
    //
    constructor(props){
        super(props) ;
        this.state = {
            flagCached: false,
            flagValidBot: false,
            widgetVisible: true,
            idAgent: this.props.idAgent || false,
            backEndServer: this.props.backEndServer ? this.props.backEndServer : false,
            idConversation: "",
            chatlog: [],
            chatEvents: [],
            options: ( this.props.options && this.props.options!=false ) ? this.props.options : {}
        } ;
        //
    } ;
    //
    static getDerivedStateFromProps(newProps,state){
        //
        if ( newProps.options && typeof newProps.options=="object" && JSON.stringify(newProps.options)!=JSON.stringify(state.options) || newProps.idAgent!=state.idAgent ){
            let newState = { idAgent: newProps.idAgent } ;
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
    componentDidMount(){
        try {
            //
            let resultValidation = validateProps( this.props );
            if ( resultValidation.validProps==true ){
                //
                const { getChatbotInfo, getIdConversation, PARAMETROS } = api( {backEndServer: this.state.backEndServer} ) ;
                getIdConversation(false, this.state.options.training)
                    .then((respIdConversation)=>{
                        return getChatbotInfo( {idChatbot: this.state.idAgent, idConversation: respIdConversation.id} ) ;
                    })
                    .then((respData)=>{
                        //
                        let newState = {
                            flagCached: true,
                            flagValidBot: false,
                            idConversation: respData.result.idConversation || false,
                            chatlog: respData.result.chatlog || [] ,
                            chatEvents: respData.result.chatEvents || [],
                            options: this.state.options || false
                        } ;
                        //
                        if ( respData.result.resultCode==PARAMETROS.RESULT_CODES.OK ){
                            //
                            //console.log('....respData.result: ',respData.result) ;
                            newState.flagValidBot    = true ;
                            // newState.options.options = respData.result.options ? {...respData.result.options} : {...respData.result} ;
                            newState.options = respData.result.options ? {...respData.result.options} : {...respData.result} ;
                            // Sobreescribe valores de configuracion en DB, por valores indicados localmente
                            if ( this.props.options && this.props.options!=false ){
                                for ( let keyConf in this.props.options ){
                                    let valConf = this.props.options[keyConf] ;
                                    if ( valConf && String(valConf).length>0 ){
                                        newState.options[keyConf] = valConf ;
                                    }
                                }
                            }
                            //
                            ls( PARAMETROS.SESSION.ID_CONVERSATION, respData.result.idConversation ) ;
                            /*
                            if ( newState.chatlog && newState.chatlog.length==1 && newState.chatlog[0].userMessage=="" ){
                                newState.chatlog = [] ;
                            }
                            console.log('....newState: ',newState);
                            */
                            this.setState( newState ) ;
                            //
                        } else {
                            console.log('....CHATBOT IS NOT VALID ---> ',respData.result.error) ;
                            this.setState({ flagCached: true, flagValidBot: false }) ;
                        }
                    })
                    .catch((respErr)=>{
                        console.dir(respErr) ;
                        this.setState({ flagCached: true, flagValidBot: false }) ;
                    }) ;
                //
            } else {
                console.log('...resultValidation: ',resultValidation) ;
                this.setState({ flagCached: true, flagValidBot: false }) ;
            }
            //
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
                                widgetVisible={this.state.widgetVisible}
                                backEndServer={this.state.backEndServer}
                                onWindowOpen={this.props.onWindowOpen   ? this.props.onWindowOpen : ()=>{console.log('....windowOpen')}}
                                onWindowClose={this.props.onWindowClose ? this.props.onWindowClose : ()=>{console.log('....windowClose')}}
                                conversation={{idConversation: this.state.idConversation,chatlog: this.state.chatlog, chatEvents: this.state.chatEvents}}
                            />
                        :   <div key="11" ></div> ;
        //
        return ( outRender ) ;
        //
    }
    //
}
//