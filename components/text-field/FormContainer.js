import React, { useState } from 'react'
import { connect } from 'react-redux'

const FormContainer = (props) => {
    const [expanded, setExpanded] = useState(false)

    const signInWarning = props.token ? null : (
        <h3 className="warning-container">must be signed to perform the these actions</h3>
    )
    if (expanded) {
        return (
            <div className="form-wrapper">
                <div className="form-container" style={{borderTopColor: props.pallette.color}}>
                    <div onClick={() => setExpanded(!expanded)} className="expanded-overlay SWM" style={{backgroundColor: props.pallette.color}}>
                        <img src={props.pallette.shrinkIcon} className="overlay-image-expanded" alt="shrink form" />
                    </div>
                    {signInWarning}
                    {props.children}
                </div>
            </div>
        )

    }

    return (
        <React.Fragment>
            <div className="form-wrapper HWM">
                <div className="form-container" style={{borderTopColor: props.pallette.color}}>
                    {signInWarning}
                    {props.children}
                </div>
            </div>
            <div className="form-wrapper-m">
                <div onClick={() => setExpanded(!expanded)} className="expand-overlay SWM" style={{backgroundColor: props.pallette.color}}>
                    <img src={props.pallette.handshakeIcon} className="overlay-image" alt="expand form" />
                </div>                
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
	return {
        token: state.token
	}
}
export default connect(
    mapStateToProps
)(FormContainer)