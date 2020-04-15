/*
*
*/
import React, { Suspense }      from 'react' ;
//import ReactReveal              from 'react-reveal' ;
import HeadShake                from 'react-reveal/HeadShake' ;
// import { ImageLoader }          from '../image/ImageLoader' ;
import WaibocLogo               from '../../../img/WAIBOC.LAUNCHER.TRANSPARENT.png' ;
/*
const getComponent = Component => props => {
    console.log('....get:: Component: ',Component,' props: ',props) ;
    return (
        <Suspense fallback={<div></div>} >
            <ImageLoader  key={"IIMGG"}
                        src={props.src}
                        altImg={""}
                        className="" loadingClassName="loading" loadedClassName=""
                        //customStyle={{img:{marginTop:'10px'}}}
                        title={""}
                        alt={""}
            />
        </Suspense>
        )
};
*/
// const ImageLogo = getComponent( React.lazy( ()=> import('../../../img/WAIBOC.LAUNCHER.TRANSPARENT.png') ) ) ;
// const EffectLauncher = props => getComponent( React.lazy(() => import( props.effectType )) );
//
export class ButtonLauncher extends React.Component {
    //
    constructor(props){
        super(props) ;
        this.state = {
            //effectType: this.props.effectType ? `react-reveal/${this.props.effectType}` : `react-reveal/HeadShake`,
            effectIntervalTime: this.props.effectIntervalTime ? this.props.effectIntervalTime : 7000,
            interval: 0
        } ;
        this.effectCB    = HeadShake ;
        this.onClickBtn  = this.onClickBtn.bind(this) ;
        this.intervalSpy = false ;
        this.propsButton = {} ;
    } ;
    //
    componentDidMount(){
        try {
            /*
            let effectIport  = `react-reveal/${this.state.effectType}` ;
            import( effectIport )
                .then((cbEffect)=>{
                    this.state.effectCB
                })
            switch( this.state.effectType ){
                case "HeadShake":
                break ;
                default:
                break ;
            }
            */
            //
            this.propsButton = {...this.props} ;
            delete this.propsButton.effectIntervalTime ;
            delete this.propsButton.effectType ;
            delete this.propsButton.imageLauncher ;
            //
            this.intervalSpy = setInterval(() => {
                this.setState({interval: (this.state.interval+1) })
            }, this.state.effectIntervalTime ) ;
            //
        } catch(errDM){
            console.dir(errDM) ;
        }
    }
    //
    onClickBtn(argOpt){
        try {
            if ( this.intervalSpy!=false ){
                clearInterval(this.intervalSpy) ;
            }
            if ( this.props.onClick ){
                this.props.onClick(argOpt) ;
            }
        } catch(errCOB){
            console.log('...ERROR: errCOB: ',errCOB) ;
        }
    }
    //
    render(){
        /*
            console.log('...this.state.effectType: ',this.state.effectType) ;
            <Suspense fallback={ <img src="/img/output-onlinepngtools.2.png" style={{width:'100%',height:'auto'}} /> } >
                <EffectLauncher effectType={this.state.effectType} spy={this.state.interval} >
                    <img src="/img/output-onlinepngtools.2.png" style={{width:'100%',height:'auto'}} />
                </EffectLauncher>
            </Suspense>
        */
       //  <img src={WaibocLogo} style={{width:'100%',height:'auto'}} />
       // <ImageLoader  key={"IIMGG"} src={this.props.imageLauncher} altImg={""} className="" loadingClassName="" loadedClassName="" customStyle={{}} title={""} alt={""} />
        //
       // console.dir(this.props.imageLauncher) ;
       //
        return(
            <button {...this.propsButton} onClick={this.onClickBtn} >
                <HeadShake spy={this.state.interval} >
                <img src={WaibocLogo} style={{width:'100%',height:'auto'}} />
                </HeadShake>
            </button>
        )
    }
    //
} ;
//