/*
*
*/
import React, { Component }                                      from 'react'  ;
import { Widget, addResponseMessage, renderCustomComponent }     from 'react-chat-widget'    ;
import { toggleMsgLoader, addUserMessage   }                     from 'react-chat-widget'    ;
import { isWidgetOpened, toggleWidget, dropMessages }            from 'react-chat-widget'    ;
import { CustomReply  }                                          from './CustomReply'        ;
import { ButtonLauncher }                                        from './button/ButtonLauncher' ;
import { api }                                                   from '../api/api' ;
//
if ( process.env.AMBIENTE!="produccion" ){ process.env.DEBUG="waiboc:*" ; } ;
//
import 'react-chat-widget/lib/styles.css' ;
import '../../css/estiloChat.css' ;
//
const log  = require('debug')('waiboc:widgetChatbot') ;
//
export class WidgetChatbot extends Component {
  constructor(props) {
    super(props) ;
    this.state         = {
      chatInitiated: false,
      chatOpen: false,
      prevWidgetVisible: true,
      widgetVisible: true ,
      pendientes: 1,
      launcher: this.props.launcher,
      showCloseButton: ( this.props.launcher!=false ),
      idConversation: this.props.conversation.idConversation,
      options: ( this.props.configuration && this.props.configuration.options )
                  ? {...this.props.configuration.options}
                  : {botName: '',botSubtitle: '',senderPlaceholder: ''},
      systemDefinedIntents: []
    } ;
    this.state.options.nameToDisplay = this.state.options.nameToDisplay ? this.state.options.nameToDisplay : this.state.options.botName ;
    //
    this.refInput              = false ;
    this.refWidget             = false ;
    this.setInputEditable      = this.setInputEditable.bind(this) ;
    this.handleNewUserMessage  = this.handleNewUserMessage.bind(this) ;
    this.onClickOpcion         = this.onClickOpcion.bind(this) ;
    this.chatOpenedHandler     = this.chatOpenedHandler.bind(this) ;
    this.chatClosedHandler     = this.chatClosedHandler.bind(this) ;
    this.mensajePrevio         = { input: { text: "" } } ;
    this.setRefWidgetDiv       = this.setRefWidgetDiv.bind(this) ;
    this.handleLauncher        = this.handleLauncher.bind(this)  ;
    //
    this.extraPropsWidget = {
      launcher: this.state.launcher==false
                  ? (launcher) => { <div></div> }
                  : (launcher) => {
                      return (
                          <a key="ll_key" onClick={()=>{this.handleLauncher(launcher)}} className="waiboc-btn-launcher" >
                            <ButtonLauncher effectIntervalTime={2000} imageLauncher={this.state.options.imageLauncher ? this.state.options.imageLauncher : "../../../img/WAIBOC.LAUNCHER.TRANSPARENT.png"}  />
                          </a>
                        )
                      }
    } ;
    //
    log('*** WidgetChatbot:: constructor ****') ;
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
  componentDidMount(){
    try {
      //
      log('.......WidgetChatlog:: componentDidMount:: this.state.options: ',this.state.options) ;
      //
      if ( this.state.options.cssStyle && this.state.options.cssStyle.header ){
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `#waiboc-widget-main .rcw-conversation-container .rcw-header { background-color: ${this.state.options.cssStyle.header.backgroundColor} ; }`;
        document.getElementsByTagName('head')[0].appendChild(style);
      }
      //
      if ( this.props.conversation.chatlog.length==0 ){
        dropMessages() ;
      } else {
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
                                  toggleInput: ()=>{} //toggleInputDisabled.bind(this)
                                }, false ) ;
          }
        }
        toggleMsgLoader() ;
      }
      if ( this.state.launcher==false && isWidgetOpened()==false ){
        toggleWidget() ;
      }
      //
    } catch(errDM){
      console.dir(errDM) ;
    }
  }
  //
  componentDidUpdate(prevProps, prevState){
    try {
      log('....widgetChatbot:: componentDidUpdate:: prevState.launcher: ',prevState.launcher,' current: ',this.state.launcher) ;
      if ( prevState.launcher!=this.state.launcher ){
        this.extraPropsWidget = {
          launcher: this.state.launcher==false
                      ? (launcher) => { <div></div> }
                      : (launcher) => {
                          return (
                              <a key="ll_key" onClick={()=>{this.handleLauncher(launcher)}} className="waiboc-btn-launcher" >
                                <ButtonLauncher effectIntervalTime={2000} imageLauncher={this.state.options.imageLauncher ? this.state.options.imageLauncher : "../../../img/WAIBOC.LAUNCHER.TRANSPARENT.png"}  />
                              </a>
                            )
                          }
        } ;
      }
    } catch(errDU){
      console.log('.....errDU: ',errDU) ;
    }
  }
  //
  setInputEditable(argFlag,argMM){
    try {
      //
      //console.log('....state: ',this.state.flagInputDisable,' arg: ',argFlag) ;
      // this.refInput
      if ( this.refInput==false &&  this.refWidget!=false ){
        this.refInput = this.refWidget.querySelectorAll('form.rcw-sender input.rcw-new-message') ;
        if ( this.refInput.length>0 ){ this.refInput=this.refInput[0]; }
      }
      //
      let flagToggleInput = false ;
      if ( this.refInput.disabled==true && argFlag==true ){
        flagToggleInput = true ;
      } else {
        if ( this.refInput.disabled==false && argFlag==false ){
          flagToggleInput = true ;
        }
      }
      console.log('... (A) argMM: ',argMM,' refInput.disabled: ',this.refInput.disabled,' argFlag: ',argFlag,' flagToggleInput: ',flagToggleInput) ;
      //
      //if ( this.state.flagInputDisable!=argFlag ){
      if ( flagToggleInput==true ){
        // toggleInputDisabled() ;
        this.refInput.disabled = !this.refInput.disabled ;
        // this.refInput.setAttribute("disabled", (!this.refInput.disabled) ) ;
        console.log('... (BBBB) argMM: ',argMM,' refInput.disabled: ',this.refInput.disabled,' argFlag: ',argFlag) ;
          // this.setState({ flagInputDisable: argFlag }) ;
      }
      //
    } catch(errCTI){
      console.log('..ERROR: CustomToggleInput:: error: ',errCTI) ;
    }
  }
  //
  setRefWidgetDiv(argRef){
      if ( argRef && this.refWidget==false ){
        this.refWidget = argRef ;
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
          if ( onOpenChatAnswer ){
            renderCustomComponent( CustomReply.bind(this) ,
            {
              datos: {answer:{output:{...onOpenChatAnswer.answer}}} ,
              onClickOpcion:this.onClickOpcion.bind(this) ,
              windowStyle: this.props.configuration.windowStyle,
              addMsg: addResponseMessage.bind(this) ,
              onOpen: this.chatOpenedHandler ,
              onClose: this.chatClosedHandler ,
              // setInputEditable: this.setInputEditable.bind(this)
              setInputEditable: ()=>{/* nada */}
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
      this.setState({chatOpen: true, pendientes: 0}) ;
    }
  }
  //
  chatClosedHandler(){
    /* NO SE USA MAS
    if ( this.state.chatOpen!=false ){
      this.props.onWindowClose() ;
      this.setState({chatOpen: false}) ;
    }
    */
  }
  //
  onClickOpcion(argTextSearch){
    try {
      //
      if ( argTextSearch && argTextSearch.length>0 ){
        this.handleNewUserMessage({ intent: argTextSearch }) ;
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
    let searchInNlp        = ( typeof newMessage=="object" ) ? newMessage : { text: newMessage } ;
    //
    toggleMsgLoader();
    fetchChatbot({idAgente: this.props.configuration.idAgent,_id: this.state.idConversation,input: searchInNlp })
      .then((respBot)=>{
          renderCustomComponent( CustomReply.bind(this) ,
                    {
                      datos: respBot ,
                      onClickOpcion:this.onClickOpcion.bind(this) ,
                      windowStyle: this.props.configuration.windowStyle,
                      addMsg:addResponseMessage.bind(this) ,
                      onOpen: this.chatOpenedHandler ,
                      onClose: this.chatClosedHandler ,
                      setInputEditable: ()=>{/* nada */}
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
  render() {
    //
    log('..........WidgetChatlog:: render:: this.props.conversation.chatlog: ',this.props.conversation.chatlog.length) ;
    return (
      <div id="waiboc-widget-main" ref={this.setRefWidgetDiv} >
          <Widget
            handleNewUserMessage={this.handleNewUserMessage}
            title={this.state.options.nameToDisplay}
            subtitle={this.state.options.botSubtitle}
            senderPlaceHolder={this.state.options.senderPlaceholder}
            showCloseButton={this.state.showCloseButton}
            badge={this.state.pendientes}
            autofocus={true}
            {...this.extraPropsWidget}
          />
      </div>
      )
  }
}
//