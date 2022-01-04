export default (type: string) => {
  return import('./rest').then(factory => factory.default());
  // switch (type) {
  //       case 'graphql':
  //           return import('./graphql').then(factory => factory.default());
  //       default:
  //           return import('./rest').then(factory => factory.default());
  //   }
};
