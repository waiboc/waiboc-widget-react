/*
*
*/
import React                                    from 'react' ;
import { Carousel, Row, Col }                   from 'antd'  ;
import { IconArrows }                           from '../icon/IconArrows'     ;
//
export class CarouselImagenes extends React.Component {
    // 
    constructor(props) {
        super(props) ;
        let tempStyle = this.props.styleArrows ? this.props.styleArrows : {} ;
        this.state = {
            currentSlide: 0,
            refCarousel: false,
            styleArrows: {...tempStyle, transition: 'all 0.3s ease-in-out',display:'none'}
        } ;
        //
        this.onMouseOverCarousel = this.onMouseOverCarousel.bind(this) ;
        this.onMouseOutCarousel  = this.onMouseOutCarousel.bind(this)  ;
        this.carouselSettings = {
            className: "slider variable-width",
            // dots: true,
            // lazyLoad : true,
            //edgeFriction: 1,
            infinite: false,
            arrows: false,
            centerMode: (window.innerWidth<797) ? false : true,
            centerPadding: '60px',
            variableWidth: (window.innerWidth<797) ? false : true,
            //swipeToSlide: true,
            //variableWidth: true,
            //accessibility: true,
            autoplay: true,
            autoplaySpeed: 93000,
            // cssEase: "linear",
            slidesToShow: 1,
            // slidesToScroll: 1,
            afterChange: current => {this.setState({ currentSlide: current })},
            // prevArrow: <SlickArrowLeft />,
            // nextArrow: <SlickArrowRight />,
            focusOnSelect: false,
            draggable: false
          };
          if ( this.props.settings ){
              for ( let keySet in this.props.settings ){
                this.carouselSettings[keySet] = this.props.settings[keySet] ;
              }
          }
          //
    }
    //
    onMouseOverCarousel(argEE){
        try {
            if ( argEE && argEE.preventDefault  ){ argEE.preventDefault(); }
            let { styleArrows } = this.state ;
            styleArrows.display = 'block' ;
            this.setState({styleArrows: styleArrows}) ;
        } catch(errOMO){
            console.log('...ERROR: errOMO: ',errOMO) ;
        }
    }
    //
    onMouseOutCarousel(argEE){
        try {
            if ( argEE && argEE.preventDefault  ){ argEE.preventDefault(); }
            let { styleArrows } = this.state ;
            styleArrows.display = 'none' ;
            this.setState({styleArrows: styleArrows}) ;
        } catch(errOMO){
            console.log('...ERROR: errOMO: ',errOMO) ;
        }
    }
    //
    goToEnd(){
        //
        if ( this.state.refCarousel!=false && this.props.data.length>1 ) {
            this.state.refCarousel.goTo( (this.props.data.length-1) )
        }
    }
    //
    render(){
        //
        let tempSettings = {...this.carouselSettings} ;
        if ( this.props.data.length<2 ){
            tempSettings.autoplay     = false ;
            tempSettings.slidesToShow = 1 ;
            tempSettings.centerMode   = true  ;
        }
        //
        return(
            <div className="waiboc-carousel" onMouseEnter={this.onMouseOverCarousel} onMouseLeave={this.onMouseOutCarousel} >
                <div style={{width:'100%'}} >
                    <Carousel {...tempSettings}
                        ref={
                        (argRef)=>{
                            if ( argRef && this.state.refCarousel==false ){
                                // console.log('..........CarouselIMGGg:: render:: argRef: ',argRef) ;
                                this.setState({refCarousel:argRef}) ;
                            }
                        }
                        }
                    >
                        {
                            this.props.data
                        }
                    </Carousel>
                    {
                        ( this.props.arrows==true && this.state.refCarousel!=false && this.props.data.length>1)
                            ?   <IconArrows   type="default"
                                        onClickPrev={
                                                (propsNNN)=>{
                                                    console.log('...propsNNN: ',propsNNN) ;
                                                    this.state.refCarousel.prev()
                                                }
                                        }
                                        styleArrows={this.state.styleArrows}
                                        infinite={this.carouselSettings.infinite}
                                        onClickNext={()=>{this.state.refCarousel.next()}}
                                        currentSlide={this.state.currentSlide}
                                        countSlide={this.props.data.length}
                                />
                            :   null
                    }
                </div>
            </div>
        )
    }
    //
} ;
//