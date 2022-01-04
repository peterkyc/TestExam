import React, { useState } from 'react'
import PropTypes from 'prop-types'
import useGoogleLogout from './use-google-logout'
import ButtonContent from './button-content'
import { getActiveStyle, getDefaultStyle, getStyle, hoveredStyle } from "./type"
// import Icon from './icon'

const GoogleLogout = props => {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const {
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
    onLogoutSuccess,
    clientId,
    cookiePolicy,
    loginHint,
    hostedDomain,
    fetchBasicProfile,
    redirectUri,
    discoveryDocs,
    onFailure,
    onScriptLoadFailure,
    uxMode,
    scope,
    accessType,
    jsSrc
  } = props

  const { signOut, loaded } = useGoogleLogout({
    jsSrc,
    onFailure,
    onScriptLoadFailure,
    clientId,
    cookiePolicy,
    loginHint,
    hostedDomain,
    fetchBasicProfile,
    discoveryDocs,
    uxMode,
    redirectUri,
    scope,
    accessType,
    onLogoutSuccess
  })
  const disabled = disabledProp || !loaded
  if (render) {
    return render({ onClick: signOut, disabled })
  }
  const initialStyle = getStyle(theme);
  const activeStyle = getActiveStyle(theme);
  const defaultStyle = getDefaultStyle({ theme, disabled, active, hovered, initialStyle, activeStyle, disabledStyle });
  const GoogleLogoutButton = React.createElement(
    tag,
    {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => {
        setHovered(false)
        setActive(false)
      },
      onMouseDown: () => setActive(true),
      onMouseUp: () => setActive(false),
      onClick: signOut,
      style: defaultStyle,
      type,
      disabled,
      className
    },
    [
      // icon && <Icon key={1} active={active} />,
      <ButtonContent icon={icon} key={2}>
        {children || buttonText}
      </ButtonContent>
    ]
  )

  return GoogleLogoutButton
}

GoogleLogout.propTypes = {
  jsSrc: PropTypes.string,
  buttonText: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node,
  disabledStyle: PropTypes.object,
  tag: PropTypes.string,
  disabled: PropTypes.bool,
  onLogoutSuccess: PropTypes.func,
  type: PropTypes.string,
  render: PropTypes.func,
  theme: PropTypes.string,
  icon: PropTypes.bool,
  onFailure: PropTypes.func,
  onScriptLoadFailure: PropTypes.func
}

GoogleLogout.defaultProps = {
  type: 'button',
  tag: 'button',
  buttonText: 'Logout of Google',
  disabledStyle: {
    opacity: 0.6
  },
  icon: true,
  theme: 'light',
  jsSrc: 'https://apis.google.com/js/api.js'
}

export default GoogleLogout
