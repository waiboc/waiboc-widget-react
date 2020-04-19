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
// let flagInputDisable = true ;
export class WidgetChatbot extends Component {
  constructor(props) {
    super(props) ;
    const { options }  = this.props.configuration ;
    this.state                 = {
      // flagInputDisable: true,
      chatInitiated: false,
      chatOpen: false,
      prevWidgetVisible: true,
      widgetVisible: true ,
      pendientes: 1,
      idConversation: this.props.conversation.idConversation,
      options: options ? {...options} : {botName: '',botSubtitle: '',senderPlaceholder: ''},
      systemDefinedIntents: []
    } ;
    this.refInput              = false ;
    this.refWidget             = false ;
    this.setInputEditable      = this.setInputEditable.bind(this) ;
    this.handleNewUserMessage  = this.handleNewUserMessage.bind(this) ;
    this.onClickOpcion         = this.onClickOpcion.bind(this) ;
    this.chatOpenedHandler     = this.chatOpenedHandler.bind(this) ;
    this.chatClosedHandler     = this.chatClosedHandler.bind(this) ;
    this.mensajePrevio         = { input: { text: "" } } ;
    this.handleLauncher          = this.handleLauncher.bind(this) ;
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
      console.log('\n\n ....********* componentDidMount:: ') ;
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
      console.log('\n\n ....********* FINT         componentDidMount:: ') ;
      //
    } catch(errDM){
      console.dir(errDM) ;
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
  handleLauncher(argLauncher){
    try {
      argLauncher() ;
      if ( this.state.chatInitiated==false ){
        if ( this.props.conversation.chatlog.length==0 ){
          toggleMsgLoader() ;
          let onOpenChatAnswer = this.props.conversation.chatEvents.find((elemEvent)=>{ return elemEvent.name=="ON_OPEN_WIDGET" }) ;
          //console.log('...onOpenChatAnswer: ',onOpenChatAnswer) ;
          if ( onOpenChatAnswer ){
            console.log('....como si reien abriera el chat') ;;
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
        //console.log('\n\n******* handleNewUserMessage:: msg: ----> ',newMessage) ;
          renderCustomComponent( CustomReply.bind(this) ,
                    {
                      datos: respBot ,
                      onClickOpcion:this.onClickOpcion.bind(this) ,
                      windowStyle: this.props.configuration.windowStyle,
                      addMsg:addResponseMessage.bind(this) ,
                      onOpen: this.chatOpenedHandler ,
                      onClose: this.chatClosedHandler ,
                      // setInputEditable: this.setInputEditable.bind(this)
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
    return (
      //
      // effectType={this.state.options.effectType}
      //
      <div   id="waiboc-widget-main"
              ref={
                (argRef)=>{
                  if ( argRef && this.refWidget==false ){ this.refWidget=argRef; }
                }
              }
      >
          <Widget
            handleNewUserMessage={this.handleNewUserMessage}
            title={this.state.options.nameToDisplay ? this.state.options.nameToDisplay : this.state.options.botName}
            subtitle={this.state.options.botSubtitle}
            senderPlaceHolder={this.state.options.senderPlaceholder}
            showCloseButton={true}
            badge={this.state.pendientes}
            autofocus={true}
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