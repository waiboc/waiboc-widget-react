/*
*
*/
import React, { Component }                                      from 'react'  ;
import { Button }                                                from 'antd'   ;
import { Widget, addResponseMessage, renderCustomComponent }     from 'react-chat-widget'    ;
import { toggleInputDisabled ,toggleMsgLoader, addUserMessage }  from 'react-chat-widget'    ;
import { CustomReply  }                                          from './CustomReply'        ;
import { ButtonLauncher }                                        from './button/ButtonLauncher' ;
// import { fetchChatbot }                                          from '../api/api' ;
import { api }                                                   from '../api/api' ;
//
import 'react-chat-widget/lib/styles.css' ;
import '../../css/estiloChat.css' ;
//
//import logoSVG                                                   from '../../img/waiboc.logo.svg';
//import WaibocIcon                 from '../../img/waiboc.icon.svg' ;
//
let flagInputDisable = true ;
export class WidgetChatbot extends Component {
  constructor(props) {
    super(props) ;
    const { options }  = this.props.configuration ;
    this.state                 = {
      flagInputDisable: true,
      chatInitiated: false,
      chatOpen: false,
      prevWidgetVisible: true,
      widgetVisible: true ,
      pendientes: 1,
      idConversation: this.props.conversation.idConversation,
      options: options ? {...options} : {botName: '',botSubtitle: '',senderPlaceholder: ''},
      systemDefinedIntents: []
    } ;
    this.customToggleInputDisabled = this.customToggleInputDisabled.bind(this) ;
    this.handleNewUserMessage  = this.handleNewUserMessage.bind(this) ;
    this.onClickOpcion         = this.onClickOpcion.bind(this) ;
    this.chatOpenedHandler     = this.chatOpenedHandler.bind(this) ;
    this.chatClosedHandler     = this.chatClosedHandler.bind(this) ;
    this.mensajePrevio         = { input: { text: "" } } ;
    this.handleLauncher          = this.handleLauncher.bind(this) ;
  }
  //
  componentDidMount(){
    try {
      //
      toggleMsgLoader();
      let tempChatlog = this.props.conversation.chatlog.sort( (a,b)=>{ return a.ts.localeCompare(b.ts); }) ;
      for (let icl=0; icl<tempChatlog.length; icl++){
        let objConv = tempChatlog[icl] ;
        if ( objConv.intent  && String(objConv.intent).length>0 ){
          if ( objConv.userMessage && objConv.userMessage.text && String(objConv.userMessage.text)!="undefined" && objConv.userMessage.text!=objConv.intent ){
            addUserMessage( String(objConv.userMessage.text) ) ;
          }
          renderCustomComponent( CustomReply.bind(this) ,
                              {
                                datos: objConv.answer ,
                                timestamp: objConv.ts,
                                onClickOpcion:this.onClickOpcion.bind(this),
                                addMsg: addResponseMessage.bind(this) ,
                                windowStyle: this.props.configuration.windowStyle,
                                onOpen: this.chatOpenedHandler ,
                                onClose: this.chatClosedHandler,
                                // ,toggleInput: toggleInputDisabled.bind(this)
                              }, false ) ;
        }
      }
      toggleMsgLoader() ;
      //
    } catch(errDM){
      console.dir(errDM) ;
    }
  }
  //
  customToggleInputDisabled(argFlag, argMM){
    try {
      //
      if ( flagInputDisable!=argFlag ){
        let tempTime = argFlag==true ? 500 : 200 ;
        setTimeout(() => {
          toggleInputDisabled() ;
          flagInputDisable = argFlag ;
        }, tempTime );
        // this.setState({flagInputDisable: argFlag}) ;
      }
      //
    } catch(errCTI){
      console.log('..ERROR: CustomToggleInput:: error: ',errCTI) ;
    }
  }
  //
  handleLauncher(argLauncher){
    try {
      argLauncher() ;
      if ( this.state.chatInitiated==false ){
        if ( this.props.conversation.chatlog.length==0 ){
          toggleMsgLoader() ;
          let onOpenChatAnswer = this.props.conversation.chatEvents.find((elemEvent)=>{ return elemEvent.name=="ON_OPEN_WIDGET" }) ;
          //console.log('...onOpenChatAnswer: ',onOpenChatAnswer) ;
          if ( onOpenChatAnswer ){
            renderCustomComponent( CustomReply.bind(this) ,
            {
              datos: {answer:{output:{...onOpenChatAnswer.answer}}} ,
              onClickOpcion:this.onClickOpcion.bind(this) ,
              windowStyle: this.props.configuration.windowStyle,
              addMsg: addResponseMessage.bind(this) ,
              onOpen: this.chatOpenedHandler ,
              onClose: this.chatClosedHandler ,
              toggleInput: this.customToggleInputDisabled.bind(this)
            }, false ) ;
          } else {
            console.log('....ERROR:: No existe Evento "ON_OPEN_WIDGET" ') ;
          }
          toggleMsgLoader();
        }
        this.setState({ chatInitiated: true }) ;
      }
      //
    } catch(errHT){
      console.log('...ERROR: ',errHT) ;
    }
  }
  //
  chatOpenedHandler(){
    if ( this.state.chatOpen!=true ){
      // console.log('....openn:: this.props.conversation: ',this.props.conversation) ;
      /*
      if ( !this.props.conversation.chatlog || this.props.conversation.chatlog.length==0 ){
        this.handleNewUserMessage( 'ON_OPEN_WIDGET' ) ;
      }
      */
      /*
      if ( this.props.onWindowOpen ){
        this.props.onWindowOpen() ;
      }
      */
      this.setState({chatOpen: true, pendientes: 0}) ;
    }
  }
  //
  chatClosedHandler(){
    if ( this.state.chatOpen!=false ){
      this.props.onWindowClose() ;
      this.setState({chatOpen: false}) ;
    }
  }
  //
  onClickOpcion(argTextSearch){
    try {
      //
      if ( argTextSearch && argTextSearch.length>0 ){
        this.handleNewUserMessage( argTextSearch ) ;
      }
      //
    } catch(errOCO){
      console.dir(errOCO) ;
    }
  }
  //
  handleNewUserMessage(newMessage){
    /*
    *   __URL_BACKEND__: Es generada por webpack en momento del Build
    */
    const { fetchChatbot } = api( {backEndServer: this.props.backEndServer} ) ;
    //
    toggleMsgLoader();
    fetchChatbot({idAgente: this.props.configuration.idAgent,_id: this.state.idConversation,input:{text:newMessage} })
      .then((respBot)=>{
        //console.log('\n\n******* handleNewUserMessage:: msg: ----> ',newMessage) ;
          renderCustomComponent( CustomReply.bind(this) ,
                    {
                      datos: respBot ,
                      onClickOpcion:this.onClickOpcion.bind(this) ,
                      windowStyle: this.props.configuration.windowStyle,
                      addMsg:addResponseMessage.bind(this) ,
                      onOpen: this.chatOpenedHandler ,
                      onClose: this.chatClosedHandler ,
                      // toggleInput: toggleInputDisabled
                      toggleInput: this.customToggleInputDisabled.bind(this)
                    }, false ) ;
          toggleMsgLoader();
      })
      .catch((errBot)=>{
        console.log('....ERROR: handleNewUserMessage:: error: ',errBot) ;
        toggleMsgLoader() ;
      }) ;
    //
  }
  //
  static getDerivedStateFromProps(newProps, state) {
    let newStateProps = {} ;
    if ( newProps.widgetVisible!=state.widgetVisible ){
      newStateProps["prevWidgetVisible"] = state.widgetVisible ;
      newStateProps["widgetVisible"]     = newProps.widgetVisible ;
    }
    if ( newProps.options && JSON.stringify(newProps.options)!=JSON.stringify(state.options) ){
      newStateProps["options"] = newProps.options ;
    }
    if ( Object.keys(newStateProps).length>0 ){
      return { newStateProps } ;
    } else {
      return false ;
    }
  }
  //
  render() {
    //
    return (
      //
      // effectType={this.state.options.effectType}
      //
      <div id="waiboc-widget-main" >
          <Widget
            handleNewUserMessage={this.handleNewUserMessage}
            title={this.state.options.nameToDisplay ? this.state.options.nameToDisplay : this.state.options.botName}
            subtitle={this.state.options.botSubtitle}
            senderPlaceHolder={this.state.options.senderPlaceholder}
            showCloseButton={true}
            badge={this.state.pendientes}
            autofocus={true}
            //profileAvatar={logoSVG}
            launcher={ (launcher) => {
                return (
                    <a key="ll_key" onClick={()=>{this.handleLauncher(launcher)}} className="waiboc-btn-launcher" >
                      <ButtonLauncher effectIntervalTime={2000} imageLauncher={this.state.options.imageLauncher ? this.state.options.imageLauncher : "../../../img/WAIBOC.LAUNCHER.TRANSPARENT.png"}  />
                    </a>
                  )
                }
            }
          />
      </div>
      )
      //
  }
}
//