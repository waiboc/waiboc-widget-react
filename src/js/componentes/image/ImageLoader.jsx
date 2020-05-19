import React from "react";

const _loaded = {};

export class ImageLoader extends React.Component {
  constructor(props){
      super(props) ;
      this.state = {
        loaded: _loaded[this.props.src]
      };
      this.onLoad   = this.onLoad.bind(this)  ;
  }
  //image onLoad handler to update state to loaded
  onLoad(){
    _loaded[this.props.src] = true;
    this.setState(() => ({ loaded: true }));
  };
  //
  render(){
    //
    let { className, wrapperImgClassName, wrapperTextClassName, loadedClassName, loadingClassName, customStyle , altImg, ...props } = this.props;
    className = `${className} ${this.state.loaded ? loadedClassName : loadingClassName}`;
    //
    let imgStyle = customStyle.img ? customStyle.img : {}  ;
    //
    return (
        <div style={{minHeight:'50px'}} key={this.props.src} >
          <div style={{width:'100%'}} className={wrapperImgClassName} >
              <img
                  style={imgStyle}
                  src={this.props.src}
                  onClick={this.props.onClick}
                  className={className}
                  onLoad={this.onLoad}
                  onError={this.onError}
                  alt={ this.props.alt ? this.props.alt : ""}
                  />
          </div>
          <div style={{width:'100%'}} className={wrapperTextClassName} >
            <span style={{width:'100%',...customStyle}}>{altImg}</span>
          </div>
        </div>
      ) ;
    //
  }
}
//