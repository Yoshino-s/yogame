// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import AJSON from "./AJSON";

let has = (o, k)=>Object.hasOwnProperty.call(o, k);
let isObj = o => Object(o)===o;
let rndStr = ()=>Math.random().toString(36).slice(2);

let INITACTION_ID = "__INSIDE_ACTION__"+rndStr()+"__";

function insideReducer(state, action) {
  switch(action.id) {
  case INITACTION_ID:
    return action.state;
  default:
    return state;
  }
}

let initAction = state => ({id: INITACTION_ID, state: state});

function combineReducers(...args) {
  return (state, action) => args.reduce((_state,reducer)=>reducer(_state, action), state);
}

class Store {
  constructor(inito, reducer) {
    if(!isObj(inito)||!has(inito, 'data')) throw Error("Wrong type of initial options");
    let self = this;
    let state = inito.data;
    
    let getter = new Map, setter = new Map;
    
    if(has(inito, 'computed')&&isObj(inito.computed)) {
      Object.keys(inito.computed).forEach(k=>{
        let c = inito.computed[k];
        Object.defineProperty(state, k, {
          enumerable : true,
          configurable : true,
          get() {
            return c.call(self.state);
          }
        });
      });
    }
    
    if(has(inito, 'watch')&&isObj(inito.computed)) {
      Object.keys(inito.watch).forEach(k=>{
        let c = inito.watch[k];
        setter.set(k, (target, property, value)=>{
          c.call(self.state, target[property], value);
        });
      });
    }
    
    let proxy = new Proxy(state, {
      get(target, property, receiver) {
        for(let k of getter) {
          if(property===k[0]) {
            return k[1]();
          }
        }
        return Reflect.get(target, property, receiver);
      },
      set(target, property, value, receiver) {
        for(let k of setter) {
          if(property===k[0]) {
            k[1](target, property, value);
          }
        }
        Reflect.set(target, property, value, receiver);
      }
    });
    
    this.reducer = reducer;
    this.__rawState = state;
    this.dispatch(initAction(proxy));
  }
  dispatch(action) {
    this.state = combineReducers(insideReducer, this.reducer)(this.state, action);
  }
  getState() {
    return this.state;
  }
  toJSON() {
    return AJSON.stringify(this.__rawState);
  }
  toString() {
    return this.__rawState.toString();
  }
}

export default {
  INITACTION_ID,
  combineReducers,
  Store
};