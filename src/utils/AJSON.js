function stringify(raw) {
  return JSON.stringify(raw, function(key, val) {
    let o = val;
    if(val instanceof Set) {
      o = ["__Set", ...Array.from(val)];
    }
    if(val instanceof Map) {
      o = ["__Map", ...Array.from(val.entries())];
    }
    return o;
  });
}
function parse(raw) {
  return JSON.parse(raw, function(key, val) {
    let o = val;
    if(Array.isArray) {
      switch(val[0]) {
      case "__Set":
        o.shift();
        o=new Set(o);
        break;
      case "__Map":
        o.shift();
        o = new Map(o);
        break;
      }
    }
    return o;
  });
}

export default {
  parse,
  stringify
};