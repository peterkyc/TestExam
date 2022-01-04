import FakeRest from 'fakerest';
import fetchMock from 'fetch-mock';
import generateData from 'data-generator-retail';


const FakeServerPath = "http://localhost:4000";
const win: any = window;
const realFetch = win.realFetch = win.fetch;
const inject = () => {
  const fakeFetch = window.fetch; // <-- it's fake fetch
  win.fetch = function fetch(...args) {
    let fetch, [url, opts] = args;
    if (typeof url == "string" && url && url.indexOf(FakeServerPath) >= 0) {
      fetch = fakeFetch;
    } else {
      fetch = realFetch;
    }
    return fetch.apply(this,args);
  };
}

export default () => {
  const data = generateData({ serializeDate: true });
  const restServer = new FakeRest.FetchServer(FakeServerPath);
  if (window) {
    window.restServer = restServer; // give way to update data in the console
  }
  restServer.init(data);
  restServer.toggleLogging(); // logging is off by default, enable it
  fetchMock.mock(`begin:${FakeServerPath}`, restServer.getHandler());
  inject();
  return () => fetchMock.restore();
};
