import Manager from "./Manager";
import PriorityQueue from '../utils/algorithm/PriorityQueue';
import {PromiseTimeout, UID} from '../utils/index';

export interface Task {
  fn: () => Promise<any> | any;
  id: string;
  option: {
    once?: boolean;
    priority: number;
    timeout?: number;
    context?: object;
  };
}

function executeTask(task: Task): Promise<void>|undefined {
  let res = task.fn.call(task.option.context);
  if(res instanceof Promise && task.option.timeout){
    return PromiseTimeout<void>(res, task.option.timeout);
  }
}


class TaskManager extends Manager {
  queue: PriorityQueue<Task>;
  map: Map<string, Task>;
  abandon: Set<Task>;
  rqfId: number | undefined;
  constructor() {
    super();
    this.queue = new PriorityQueue<Task>((a: Task, b: Task): number=>{
      if(a.option.priority<b.option.priority) return 1;
      if(a.option.priority>b.option.priority) return -1;
      return 0;
      
    });
    this.map = new Map<string, Task>();
    this.abandon = new Set<Task>();
    this.start();
  }
  add(task: Task): void {
    if(!task.id) task.id = UID("__inside_task");
    this.map.set((task.id), task);
    this.queue.add(task);
  }
  remove(id: string): void{
    let task = this.map.get(id);
    if(!task) return;
    this.abandon.add(task);
    this.map.delete(id);
  }
  async update(): Promise<void> {
    if(this.queue.isEmpty()) return;
    let tmpQueue = new PriorityQueue<Task>();
    let samePri: Task[] = [this.queue.dequeue() as Task];
    tmpQueue.add(samePri[0]);
    let pri = samePri[0].option.priority;
    while(!this.queue.isEmpty()) {
      let task = this.queue.dequeue() as Task;
      if(this.abandon.has(task)) {
        this.abandon.delete(task);
        continue;
      }
      if(pri!==task.option.priority) {
        await Promise.all(samePri.map(executeTask));
        pri = task.option.priority;
        samePri=[];
      }
      samePri.push(task);
      if(!task.option.once) {
        tmpQueue.add(task);
      } else {
        this.map.delete(task.id);
      }
    }
    this.queue = tmpQueue;
    this.rqfId = requestAnimationFrame(this.update.bind(this));
  }
  start(): boolean {
    if(this.rqfId !== undefined) return false;
    this.rqfId = requestAnimationFrame(this.update.bind(this));
    return true;
  }
  stop(): boolean {
    if(this.rqfId === undefined) return false;
    cancelAnimationFrame(this.rqfId);
    this.rqfId = undefined;
    return true;
  }
}

export default TaskManager;