import AJSON from "./AJSON";

interface Action {
  state: any;
  id: string;
}

type state = any;

type reducer  = (state: any, Action: Action) => any;

let has = (o: any, k: string): boolean=>Object.hasOwnProperty.call(o, k);
let isObj = (o: any): boolean => Object(o)===o;
let rndStr = (): string => Math.random().toString(36).slice(2);

let InitActionID: string = "__INSIDE_Action__"+rndStr()+"__";

function insideReducer(state: state, action: Action): state {
  switch(action.id) {
  case InitActionID:
    return action.state;
  default:
    return state;
  }
}

let initAction = (state: state): Action => ({id: InitActionID, state: state});

function combineReducers(...args: reducer[]) {
  return (state: state, action: Action): state => args.reduce((_state,reducer)=>reducer(_state, action), state);
}

class Store {
  public state: any;
  private reducer: reducer;
  private __rawState: state;
  constructor(inito: { data: any; computed: { [x: string]: () => any }; watch: { [x: string]: (old: any, newv: any) => void } }, reducer: reducer) {
    if(!isObj(inito)||!has(inito, 'data')) throw Error("Wrong type of initial options");
    // eslint-disable-next-line @typescript-eslint/no-this-alias
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
        setter.set(k, (target: { [x: string]: any }, property: string | number, value: any)=>{
          c.call(self.state, target[property], value);
        });
      });
    }
    
    let proxy = new Proxy(state, {
      get(target, property, receiver): any {
        for(let k of getter) {
          if(property===k[0]) {
            return k[1]();
          }
        }
        return Reflect.get(target, property, receiver);
      },
      set(target, property, value, receiver): boolean {
        for(let k of setter) {
          if(property===k[0]) {
            k[1](target, property, value);
          }
        }
        Reflect.set(target, property, value, receiver);
        return true;
      }
    });
    
    this.reducer = reducer;
    this.__rawState = state;
    this.dispatch(initAction(proxy));
  }
  public dispatch(action: Action): void {
    this.state = combineReducers(insideReducer, this.reducer)(this.state, action);
  }
  public getState(): Action {
    return this.state;
  }
  public toJSON(): string {
    return AJSON.stringify(this.__rawState);
  }
  public toString(): string {
    return this.__rawState.toString();
  }
}

export default {
  InitActionID,
  combineReducers,
  Store
};