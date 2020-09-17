export default class {
  constructor() {
    const watchers = {};

    this.on = (name, fn) => {
      if (watchers[name]) {
        watchers[name].push(fn);
      } else {
        watchers[name] = new Array(fn);
      }
    };

    this.off = (name, fn) => {
      const index = watchers[name].indexOf(fn);
      if (index > 0) {
        watchers[name].splice(index, 1);
        if (watchers[name].length === 0) {
          delete watchers[name];
        }
      }
    };

    this.emit = (name, ...props) => {
      if (watchers[name]) {
        for (let i = 0; i < watchers[name].length; i++)
          watchers[name][i].apply(watchers[name][i], props);
      }
    };
  }
}
