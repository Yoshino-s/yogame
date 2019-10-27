import { EventEmitter, } from "events";
import StrictEventEmitter from "strict-event-emitter-types";
import PriorityQueue from "../utils/algorithm/PriorityQueue";
import { PromiseTimeout, UID, } from "../utils/index";

interface TaskManagerEvents {
  "add": (task: Task) => void;
  "error": (task: Task, error: any) => void;
  "remove": (task: Task) => void;
  "loop": () => void;
}

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

type TaskManagerEmitter = StrictEventEmitter<EventEmitter, TaskManagerEvents>;

class TaskManager extends (EventEmitter as { new(): TaskManagerEmitter }) {
  queue: PriorityQueue<Task>;
  map: Map<string, Task>;
  abandon: Set<Task>;
  rqfId: number | undefined;
  constructor() {
    super();
    this.queue = new PriorityQueue<Task>((a: Task, b: Task): number=>{
      if(a.option.priority < b.option.priority) return 1;
      if(a.option.priority > b.option.priority) return -1;
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
    this.emit("add", task);
  }
  remove(id: string): void{
    const task = this.map.get(id);
    if(!task) return;
    this.abandon.add(task);
    this.map.delete(id);
    this.emit("remove", task);
  }
  async update(): Promise<void> {
    if(this.queue.isEmpty()) return;
    const tmpQueue = new PriorityQueue<Task>();
    let samePri: Task[] = [ this.queue.dequeue() as Task, ];
    tmpQueue.add(samePri[0]);
    let pri = samePri[0].option.priority;
    while(!this.queue.isEmpty()) {
      const task = this.queue.dequeue() as Task;
      if(this.abandon.has(task)) {
        this.abandon.delete(task);
        continue;
      }
      if(pri !== task.option.priority) {
        await Promise.all(samePri.map(this.executeTask.bind(this)));
        pri = task.option.priority;
        samePri = [];
      }
      samePri.push(task);
      if(!task.option.once) {
        tmpQueue.add(task);
      } else {
        this.map.delete(task.id);
        this.emit("remove", task);
      }
    }
    this.queue = tmpQueue;
    this.emit("loop");
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
  executeTask(task: Task): Promise<void>|undefined {
    const res = task.fn.call(task.option.context);
    if(res instanceof Promise && task.option.timeout){
      return PromiseTimeout<void>(res, task.option.timeout).catch(err => {
        this.emit("error", task, err);
      });
    }
  }
  private static defaultInstance: TaskManager;

  static get default(): TaskManager {
    if (this.defaultInstance) {
      return this.defaultInstance;
    } else {
      return (this.defaultInstance = new TaskManager());
    }
  }
}

export default TaskManager;