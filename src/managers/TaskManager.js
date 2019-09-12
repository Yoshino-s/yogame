import Manager from "./Manager";

function timeoutPromise(timeout, msg) {
  return new Promise((res, rej)=>{
    setTimeout(()=>rej(new Error(msg)), timeout);
  });
}

/**
 * The manager of all tasks.Use requestAnimationFrame to loop.
 * @extends Yogame.managers.Manager
 * @memberof Yogame.managers
 */
class TaskManager extends Manager {
  constructor() {
    super();
    this.queue = (function(){
      let start = {value: null, id:"start", priority:Infinity};
      let end = {value: null, id:"end", priority:-Infinity};
      start.next = end;
      end.last = start;
      function appendNext(n, n0) {
        n.next = n0.next;
        n.last = n0;
        n0.next.last = n;
        n0.next = n;
      }
      function appendLast(n, n0) {
        n.next = n0;
        n.last = n0.last;
        n0.last.next = n;
        n0.last = n;
      }
  
      let id = 0;
  
      let queue = {
        start: start,
        end: end,
        defStart: start, defEnd: start,
        map: new Map(),
        add(value, priority=0) {
          let node = {
            value, id: ++id, priority
          };
          if(!priority) {
            appendNext(node, this.defEnd);
            this.defEnd = node;
          } else if(priority>0) {
            let n = this.defStart;
            while(n.priority<priority) {
              n=n.last;
            }
            appendNext(node, n);
          } else if(priority<0) {
            let n = this.defEnd;
            while(n.priority>priority) {
              n=n.next;
            }
            appendLast(node, n);
          }
          this.map.set(id, node);
          return id;
        },
        get(id) {
          return this.map.get(id);
        },
        remove(id) {
          let node = this.map.get(id);
          this.map.delete(id);
          node.last.next = node.next;
          node.next.last = node.last;
          if(this.defEnd === node) {
            this.defEnd = node.last;
          }
        },
        [Symbol.iterator]: function*(){
          let _n = this.start;
          while(_n.next!== end){
            _n = _n.next;
            yield _n.value;
          }
        }
      };
      return queue;
    })();
    this.start();
  }
  /**
   * Add a task to task queue.
   * @return {number} id of task.
   * @variation 1
   * @param {function} fn - The function called in the task.
   * @param {boolean} once - Whether the task only need to do once.
   * @param {TaskOption} options - Data of resource.
   *//**
   * @variation 2
   * @param {managers.TaskManager.Task} task - The task.
   */
  add(fn, once, options) {
    let task;
    if(!(task instanceof Task)) {
      task = new Task(fn, once, options);
    } else {
      task = fn;
    }
    let id = this.queue.add(task, task.priotity);
    task.id = id;
    return id;
  }
  /**
   * Remove task from task queue.
   * @param {number} id - The id of the task to be removed.
   */
  remove(id){this.queue.remove(id);}

  /**
   * One loop of task execution.
   * @async
   */
  async update() {
    let samePri = [];
    let pri = null;
    for(let task of this.queue) {
      if(task.once) this.queue.remove(task.id);
      if(pri===task.priority){
        samePri.push(task.exec());
      } else {
        if(samePri) {await Promise.all(samePri);}
        pri=task.priority;
        samePri=[task.exec()];
      }
    }
    this.rqfId = requestAnimationFrame(this.update.bind(this));
  }
  /**
   * Start task execute loop.
   */
  start () {
    if(this.rqfId !== undefined) return false;
    this.rqfId = requestAnimationFrame(this.update.bind(this));
    return true;
  }
  /**
   * Stop task execute loop.
   */
  stop() {
    if(this.rqfId === undefined) return false;
    cancelAnimationFrame(this.rqfId);
    this.rqfId = undefined;
    return true;
  }
}
/**
 * The task with priority setting.
 * @memberof Yogame.managers.TaskManager
 * @param {function} fn - The function called in the task.
 * @param {boolean} once - Whether the task only need to do once.
 * @param {object} options - Data of resource.
 * @param {number} options.priority
 * @param {object} options.context
 * @param {number} options.timeout
 */
class Task {
  constructor(fn, once=false, options={}) {
    if(fn instanceof Function) {
      this.fn = async ()=>fn();
    }else{
      this.fn = fn;
    }
    this.once = !!once;
    this.context = options.context;
    this.priority = options.priority || 0;
    this.timeout = options.timeout;
    this.id=null;
  }
  /**
   * Execute the task.
   */
  exec() {
    return this.timeout?Promise.race([this.fn.apply(this.context),timeoutPromise(this.timeout, `Timeout in task[id=${this.id}]`)]):this.fn.apply(this.context);
  }
}

TaskManager.Task = Task;

export default TaskManager;