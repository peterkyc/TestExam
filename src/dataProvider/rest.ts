import simpleRestProvider from 'ra-data-simple-rest';
import { getUrl } from ".";
const url = getUrl() + "/api/test";
const restProvider = simpleRestProvider('http://localhost:4000');
// const restProvider = simpleRestProvider(url);

const delayedDataProvider = new Proxy(restProvider, {
  get: (target, name, self) => {
    // as we await for the dataProvider, JS calls then on it. We must trap that call or else the dataProvider will be called with the then method
    if (name === 'then')
      return self;
    return (resource: string, params: any) => {
      const resp = (resolve, ret) => {
        console.log(`rest ${resource} params:`, params, ret);
        resolve(ret);
      };
      return new Promise(resolve => {
        let ret, func = restProvider[name as string];

        try {
          ret = func(resource, params);
          if (ret instanceof Promise) {
            ret.then(ret => resp(resolve,ret));
          } else {
            resp(resolve,ret);
          }
        } catch (e) {
          console.log(`rest error ${resource} params:`, params, e);
        }
        // setTimeout(() => resolve(restProvider[name as string](resource, params)), 500);
      });
    };

  },
});

export default delayedDataProvider;
