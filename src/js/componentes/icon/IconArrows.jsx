/*
*
*/
import React                 from 'react' ;
import '../../../css/iconArrows.css' ;
//
export class IconArrows extends React.Component {
    //
    constructor(props){
        super(props) ;
        this.arrowsType = this.props.type ;
        this.onPrev     = this.onPrev.bind(this) ;
        this.onNext     = this.onNext.bind(this) ;
    } ;
    //
    onPrev(argEE){
      if ( argEE && argEE.preventDefault ){ argEE.preventDefault(); }
      this.props.onClickPrev() ;
    }
    //
    onNext(argEE){
      if ( argEE && argEE.preventDefault ){ argEE.preventDefault(); }
      this.props.onClickNext() ;
    }
    //
    render(){
        //
        // console.log('...........IconArrows:: render:: ') ;
        let styleArrowsProps = this.props.styleArrows ? this.props.styleArrows : {} ;
        const SlickArrowPrev  = ( props ) => {
          let divProps = {} ;
          if ( props.visible==true || this.props.infinite==true ){
            divProps.onClick = this.onPrev ;
            divProps.style   = {...styleArrowsProps, cursor:'pointer'}
          } else {
            divProps.style   = {...styleArrowsProps, cursor:'not-allowed'}
          }
            return (
                <div {...divProps} className="carousel-arrows carousel-arrows-prev" >
                  <div className="arrow-left"></div>
                </div>
              )
          };
          //
          const SlickArrowNext = ( props ) =>{
              let divProps = {} ;
              if ( props.visible==true || this.props.infinite==true ){
                divProps.onClick = this.onNext ;
                divProps.style   = {...styleArrowsProps, cursor:'pointer'}
              } else {
                divProps.style   = {...styleArrowsProps, cursor:'not-allowed'}
              }
              //
              return (
                  <div {...divProps} className="carousel-arrows carousel-arrows-next" >
                    <div className="arrow-right"  ></div>
                  </div>
              )
              //
        };
        //
        const { customStyle, currentSlide, countSlide } = this.props ;
        //
        if ( typeof currentSlide=="undefined" ){ throw new Error("IconArrows:: ERROR: Falta prop: 'currentSlide'"); }
        if ( typeof countSlide=="undefined"   ){ throw new Error("IconArrows:: ERROR: Falta prop: 'countSlide'"); }
        //
        let flagShowPrev = currentSlide>0  ;
        let flagShowNext = (currentSlide+1) < countSlide ;
        //
        return(
            <div className="carousel-arrows-links" style={{...customStyle}} >
                <SlickArrowPrev visible={flagShowPrev} />
                <SlickArrowNext visible={flagShowNext} />
            </div>
        )
    }
    //
} ;
//