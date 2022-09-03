class html {
  static CreateElement(type, args, path) {
    const parent = document.querySelector(path);
    const el = document.createElement(type);
    for(let arg in args) {
      el.setAttribute(arg, args[arg]);
    }
    parent.appendChild(el);
    return (args["id"] != undefined) ? "#" + args["id"] : "";
  }
}