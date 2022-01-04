
import { Fetch } from "../global";
import { Apis, join, MethodType, pathJoin } from "../../common/utils";
// import { getUserData } from "../authProvider";
import authProvider from "../authProvider";

const print = (method: "log" | "error", action: any, url: any, data: any) => console[method].apply(console,
  ["%c%s%c : %c%s", "background:yellowgreen; padding: 3px;", action,
    "background:inherit;", "background:rgb(237,163,94);", url, data]);
const log = (action: string = "", url: any, data: any) => print("log", action, url, data);
const error = (action: string = "", url: any, data: Response) => print("error", action, url, data);

// if using proxy no need to using difference API
let ApiUrl = process.env.API_URL;
console.log(`ApiUrl:${ApiUrl}`);
function request(requestUrl, data: any, options = {}) {
  if (data == null) {
    let { userId } = authProvider.getUserData() || {};
    data = { userId };
  }
  let opts: RequestInit = {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data), // must match 'Content-Type' header
    // mode: 'cors', // no-cors, cors, *same-origin
    ...options,
  };
  let url;
  if (ApiUrl && ApiUrl.startsWith("http") && ApiUrl.indexOf("://") > 0) {
    try {
      url = join(ApiUrl,requestUrl);
    } catch (e) {
      url = requestUrl;
    }
  } else {
    url = requestUrl;
  }
  log(opts.method, url, data);
  return fetch(url, opts).then(response => {
    if (response.status != 200) {
      error(`Response`, url, response);
      throw new Error(response.statusText);
    }
    log(`Response`, url, response);
    return response.json();
  });
}

const post = (path: string) => {
  const { origin } = window.location, url = path; //pathJoin(origin, path);
  return (data: any = null, options = {}) => request(url, data, options);
}
const register = post(MethodType.register);
const login = post(MethodType.login);
const logout = post(MethodType.logout);
const resetPassword = post(MethodType.resetPassword);
const resendVerifyMail = post(MethodType.resendVerifyMail);
const updateUserProfile = post(MethodType.updateUserProfile);
const listUsers = post(MethodType.listUsers);

// const changeUserInfo = post(MethodType.changeUserInfo);
// const mailTo = post(Apis["mailTo"]);

export {
  register, login, logout, resetPassword, resendVerifyMail, updateUserProfile, listUsers,
  log, error
};


