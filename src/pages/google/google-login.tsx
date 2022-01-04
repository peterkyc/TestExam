import React, { useState } from 'react'
import PropTypes from 'prop-types'
import useGoogleLogin from './use-google-login'
import ButtonContent from './button-content'
import { getActiveStyle, getDefaultStyle, getStyle } from "./type"
// import Icon from './icon'

const GoogleLogin = props => {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const {
    onSuccess,
    onAutoLoadFinished,
    onRequest,
    onFailure,
    onScriptLoadFailure,
    tag,
    type,
    className,
    disabledStyle,
    buttonText,
    children,
    render,
    theme,
    icon,
    disabled: disabledProp,
    clientId,
    cookiePolicy,
    loginHint,
    hostedDomain,
    autoLoad,
    isSignedIn,
    fetchBasicProfile,
    redirectUri,
    discoveryDocs,
    uxMode,
    scope,
    accessType,
    responseType,
    jsSrc,
    prompt
  } = props;

  const { signIn, loaded } = useGoogleLogin({
    onSuccess,
    onAutoLoadFinished,
    onRequest,
    onFailure,
    onScriptLoadFailure,
    clientId,
    cookiePolicy,
    loginHint,
    hostedDomain,
    autoLoad,
    isSignedIn,
    fetchBasicProfile,
    redirectUri,
    discoveryDocs,
    uxMode,
    scope,
    accessType,
    responseType,
    jsSrc,
    prompt
  })
  const disabled = disabledProp || !loaded
  if (render) {
    return render({ onClick: signIn, disabled })
  }
  const initialStyle = getStyle(theme);
  const activeStyle = getActiveStyle(theme);
  const defaultStyle = getDefaultStyle({ theme, disabled, active, hovered, initialStyle, activeStyle, disabledStyle });
  const googleLoginButton = React.createElement(
    tag,
    {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => {
        setHovered(false)
        setActive(false)
      },
      onMouseDown: () => setActive(true),
      onMouseUp: () => setActive(false),
      onClick: signIn,
      style: defaultStyle,
      type,
      disabled,
      className
    },
    [
      //icon && <Icon key={1} active={active} />,
      <ButtonContent icon={icon} key={2}>
      </ButtonContent>,
      <div>
        {children || buttonText}
      </div>
      ]
  )

  return googleLoginButton
}

GoogleLogin.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
  onScriptLoadFailure: PropTypes.func,
  clientId: PropTypes.string.isRequired,
  jsSrc: PropTypes.string,
  onRequest: PropTypes.func,
  buttonText: PropTypes.node,
  scope: PropTypes.string,
  className: PropTypes.string,
  redirectUri: PropTypes.string,
  cookiePolicy: PropTypes.string,
  loginHint: PropTypes.string,
  hostedDomain: PropTypes.string,
  children: PropTypes.node,
  disabledStyle: PropTypes.object,
  fetchBasicProfile: PropTypes.bool,
  prompt: PropTypes.string,
  tag: PropTypes.string,
  autoLoad: PropTypes.bool,
  disabled: PropTypes.bool,
  discoveryDocs: PropTypes.array,
  uxMode: PropTypes.string,
  isSignedIn: PropTypes.bool,
  responseType: PropTypes.string,
  type: PropTypes.string,
  accessType: PropTypes.string,
  render: PropTypes.func,
  theme: PropTypes.string,
  icon: PropTypes.bool
}

GoogleLogin.defaultProps = {
  type: 'button',
  tag: 'button',
  buttonText: 'Sign in with Google',
  scope: 'profile email',
  accessType: 'online',
  prompt: '',
  cookiePolicy: 'single_host_origin',
  fetchBasicProfile: true,
  isSignedIn: false,
  uxMode: 'popup',
  disabledStyle: {
    opacity: 0.6
  },
  icon: true,
  theme: 'light',
  onRequest: () => {}
}

export default GoogleLogin
