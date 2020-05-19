/*
*
*/
import React                                   from 'react' ;
import jstz                                    from '../libs/jstz.min.js'
import moment                                  from 'moment-timezone';
import { parseAnswer  }                        from '../utils/parseAnswer'  ;
import { DivMessage  }                         from './messages/DivMessage' ;
//
import 'antd/dist/antd.css';
//
let userTimeZone = jstz.determine().name() ;
/*
let tempLang     = navigator.language || navigator.languages[0] || 'es' ;
moment.locale(tempLang) ;
*/
//
export class CustomReply extends React.Component {
    constructor(props){
        super(props) ;
        this.state          = { flagMount: false, answerAssistant: this.props.datos.answer ? this.props.datos.answer.output : this.props.datos.output } ;
        this.wrapAnswer     = this.wrapAnswer.bind(this) ;
    } ;
    //
    componentDidMount(){
        try {
            if ( this.props.onOpen && typeof this.props.onOpen=="function" ){
                this.props.onOpen() ;
            }
            this.setState({flagMount:true}) ;
        } catch(errDM){
            console.dir(errDM) ;
        }
    }
    //
    componentWillUnmount() {
        if ( this.props.onClose && typeof this.props.onClose=="function" ){
            this.props.onClose() ;
        }
    }
    //
    wrapAnswer(elemOpt){
        try {
            //
            const { messageResponseStyle, timestamp } = this.props ;
            let tempStyle = messageResponseStyle ? messageResponseStyle : {} ;
            let tempTs    = moment( (timestamp ? timestamp : new Date()) ).tz( userTimeZone ).fromNow() ;
            //
            let outEle = parseAnswer( {answer: elemOpt, customStyle: tempStyle, onClickOpcion: this.props.onClickOpcion ,setInputEditable:(this.props.setInputEditable ? this.props.setInputEditable : null)} ) ;
            //
            return(
                <DivMessage>
                    {
                        (this.props.flagTimestamp && this.props.flagTimestamp!=false) ? <p style={{width:'100%',textAlign:'center'}}>{tempTs}</p> : null
                    }
                    <div>{  outEle }</div>
                </DivMessage>
                ) ;
            //
        } catch(errTS){
            console.dir(errTS) ;
        }
    }
    //
    render(){
        //
        // console.log('....estoy en CustomReply::render ') ;
        let outDiv = this.wrapAnswer( this.state.answerAssistant ) ;
        return( outDiv ) ;
        //
    }
    //
} ;
//