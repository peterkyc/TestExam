// @flow
import React from 'react';
// import PropTypes from 'prop-types';
import { Func } from "../../common/utils";
import { decodeParam, objectToParams, shouldAddDisabledProp } from "./utils";
import facebook from '../images/facebook.png';
interface FBProps {
  isDisabled?: boolean
  callback: Func;
  appId: string;
  xfbml?: boolean
  cookie?: boolean
  authType?: string;
  scope?: string;
  state?: string;
  responseType?: string;
  returnScopes?: boolean
  redirectUri?: string;
  autoLoad?: boolean
  disableMobileRedirect?: boolean
  isMobile?: boolean
  fields?: string;
  version?: string;
  language?: string;
  onClick?: Func;
  onFailure?: Func;
  render: Func;
};

const win: any = window;
const isMobile = () => {
  let isMobile = false, navigator: any = window.navigator;
  try {
    isMobile = !!((navigator && navigator.standalone) || navigator.userAgent.match('CriOS') || navigator.userAgent.match(/mobile/i));
  } catch (ex) {
    // continue regardless of error
  }
  return isMobile;
};

export class FBLogin extends React.Component<FBProps> {
  static defaultProps = {
    redirectUri: typeof window !== 'undefined' ? window.location.href : '/',
    scope: 'public_profile,email',
    returnScopes: false,
    xfbml: true,
    cookie: true,
    authType: '',
    fields: 'name',
    // version: '3.1',
    version: '12.0',
    language: 'en_US',
    disableMobileRedirect: false,
    isMobile: isMobile(),
    onFailure: null,
    state: 'facebookdirect',
    responseType: 'code',
  };
  state = {
    isSdkLoaded: false,
    isProcessing: false,
    autoLoad: false,
  };
  _isMounted;
  // constructor(props) {
  //   super(props);
  // }
  componentDidMount() {
    this._isMounted = true;
    if (document.getElementById('facebook-jssdk')) {
      this.sdkLoaded();
      return;
    }
    this.setFbAsyncInit();
    this.loadSdkAsynchronously();
    let fbRoot = document.getElementById('fb-root');
    if (!fbRoot) {
      fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.appendChild(fbRoot);
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.isSdkLoaded && nextProps.autoLoad && !prevState.autoLoad) {
      return { signedIn: nextProps.signedIn, autoLoad: nextProps.autoLoad };
    }
    return null;
  }
  componentDidUpdate(prevProps) {
    if (this.state.isSdkLoaded && this.state.autoLoad && !prevProps.autoLoad) {
      win.FB.getLoginStatus(this.checkLoginAfterRefresh);
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  setStateIfMounted(state) {
    if (this._isMounted) {
      this.setState(state);
    }
  }
  setFbAsyncInit() {
    const { appId, xfbml, cookie, version, autoLoad } = this.props;
    win.fbAsyncInit = () => {
      win.FB.init({ version: `v${version}`, appId, xfbml, cookie });
      this.setStateIfMounted({ isSdkLoaded: true });
      if (autoLoad || this.isRedirectedFromFb()) {
        // win.FB.getLoginStatus(this.checkLoginAfterRefresh);
        win.FB.getLoginStatus(response => {
          console.log(`getLoginStatus:`, response);
          // if (response.status === 'connected') {
          //   this.checkLoginState(response);
          // } else {
          //   win.FB.login(this.checkLoginState, { scope, return_scopes: returnScopes, auth_type: params.auth_type });
          // }
        });
      }
    };
  }
  isRedirectedFromFb() {
    const params = win.location.search;
    return (
      decodeParam(params, 'state') === 'facebookdirect' && (decodeParam(params, 'code') ||
        decodeParam(params, 'granted_scopes'))
    );
  }

  sdkLoaded() {
    this.setState({ isSdkLoaded: true });
  }

  loadSdkAsynchronously() {
    const { language } = this.props;
    ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js: any = element;
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = `https://connect.facebook.net/en_US/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  responseApi = (authResponse) => {
    win.FB.api('/me', { locale: this.props.language, fields: this.props.fields }, (me) => {
      Object.assign(me, authResponse);
      this.props.callback(me);
    });
  };
  checkLoginState = (response) => {
    this.setStateIfMounted({ isProcessing: false });
    if (response.authResponse) {
      this.responseApi(response.authResponse);
    } else {
      if (this.props.onFailure) {
        this.props.onFailure({ status: response.status });
      } else {
        this.props.callback({ status: response.status });
      }
    }
  };
  checkLoginAfterRefresh = (response) => {
    if (response.status === 'connected') {
      this.checkLoginState(response);
    } else {
      win.FB.login(loginResponse => this.checkLoginState(loginResponse), true);
    }
  };
  click = (e) => {
    if (!this.state.isSdkLoaded || this.props.isDisabled) { // this.state.isProcessing || 
      return;
    }
    this.setState({ isProcessing: true });
    const { scope, appId, onClick, returnScopes, responseType, redirectUri, disableMobileRedirect, authType, state } = this.props;
    if (typeof onClick === 'function') {
      onClick(e);
      if (e.defaultPrevented) {
        this.setState({ isProcessing: false });
        return;
      }
    }
    const params = {
      client_id: appId,
      redirect_uri: redirectUri,
      state,
      return_scopes: returnScopes,
      scope,
      response_type: responseType,
      auth_type: authType,
    };
    if (this.props.isMobile && !disableMobileRedirect) {
      win.location.href = `https://www.facebook.com/dialog/oauth${objectToParams(params)}`;
    } else {
      if (!win.FB) {
        if (this.props.onFailure) {
          this.props.onFailure({ status: 'facebookNotLoaded' });
        }
        return;
      }
      // see https://developers.facebook.com/docs/reference/javascript/FB.login/v12.0
      win.FB.login((response) => {
        if (response.authResponse) {
          const tokenObj = response.authResponse;
          win.FB.api('/me', (response) => {

            console.log(`resp:${JSON.stringify(response)}\n`, response);
            this.props.callback({ ...response, tokenObj });
          });
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      }, {
        scope: "public_profile,email", // public_profile,email, 加入 name 會 error
        return_scopes: true
      });
      // win.FB.getLoginStatus(response => {
      //   if (response.status === 'connected') {
      //     this.checkLoginState(response);
      //   } else {
      //     win.FB.login(this.checkLoginState, { scope, return_scopes: returnScopes, auth_type: params.auth_type });
      //   }
      // });
    }
  };
  render() {
    const { render } = this.props;
    if (!render) {
      throw new Error('ReactFacebookLogin requires a render prop to render');
    }
    const propsForRender = {
      onClick: this.click,
      isDisabled: !!this.props.isDisabled,
      isProcessing: this.state.isProcessing,
      isSdkLoaded: this.state.isSdkLoaded,
    };
    return this.props.render(propsForRender);
  }
}


interface FBBTProps {
  callback: Func;
  appId: string;
  autoLoad?: boolean
  textButton?: string;
  typeButton?: string;
  size?: string;
  cssClass?: string;
  icon?: any;
  containerStyle?: any;
  buttonStyle?: any;
  tag?: Func;
};

export default class FacebookLogin extends React.Component<FBBTProps> {

  static defaultProps = {
    textButton: 'Login with Facebook',
    typeButton: 'button',
    size: 'metro',
    fields: 'name',
    cssClass: 'kep-login-facebook',
    tag: 'button',
  };
  // constructor(props) {
  //   super(props);
  // }
  style() {
    // const defaultCSS = FacebookLogin.defaultProps.cssClass;
    // if (this.props.cssClass === defaultCSS) {
    //   let opts: any = { dangerouslySetInnerHTML: { __html: styles } };
    //   return <style {...opts}></style>;
    // }
    return false;
  }

  containerStyle(renderProps) {
    const { isProcessing, isSdkLoaded, isDisabled } = renderProps;

    const style: any = { transition: 'opacity 0.5s' };
    if (isProcessing || !isSdkLoaded || isDisabled) {
      style.opacity = 0.6;
    }
    return Object.assign(style, this.props.containerStyle);
  }

  renderOwnButton(renderProps) {
    const { cssClass, size, icon, textButton, typeButton, buttonStyle } = this.props;

    const { onClick, isDisabled } = renderProps;

    const isIconString = typeof icon === 'string';
    const optionalProps: any = {};
    if (isDisabled && shouldAddDisabledProp(this.props.tag)) {
      optionalProps.disabled = true;
    }
    return (
      <button {...optionalProps} className="fbButton" onClick={onClick}>
        <span style={{ paddingRight: 10, fontWeight: 500, paddingLeft: 10, paddingTop: 10, paddingBottom: 10 }}>
          <img src={facebook} alt="facebook" className="fbIcon" />
        </span>
        <div>{textButton}</div>
      </button>
    );
  }

  render() {
    return (
      <FBLogin {...this.props} render={renderProps => this.renderOwnButton(renderProps)} />
    );
  }
}
