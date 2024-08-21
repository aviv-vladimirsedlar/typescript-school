var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a;
var _TodoApplication_tasks, _TodoApplication_mainElement, _TodoApplication_tasksComponent;
// Note how the TaskInput isn't necessary once there is a TaskListComponent in place, let's
//    leave it in for now
import { TaskList, Task, TaskListComponent, TasksComponent, KanbanComponent } from './task.js';
class TodoApplication {
    constructor(tasks) {
        _TodoApplication_tasks.set(this, void 0);
        _TodoApplication_mainElement.set(this, void 0);
        this.listMappings = {
            'list': TaskListComponent, 'kanban': KanbanComponent
        };
        _TodoApplication_tasksComponent.set(this, void 0);
        __classPrivateFieldSet(this, _TodoApplication_tasks, tasks, "f");
        __classPrivateFieldSet(this, _TodoApplication_mainElement, document.getElementById('todo_list') || new HTMLElement, "f");
        __classPrivateFieldSet(this, _TodoApplication_tasksComponent, new TasksComponent(__classPrivateFieldGet(this, _TodoApplication_tasks, "f"), new KanbanComponent(taskList)), "f");
    }
    run() {
        this.redraw();
    }
    switchListing(option) {
        // !ONLY works because both listing components have the same contstructor arguments
        // Would be better to have a factory for creating listings
        __classPrivateFieldGet(this, _TodoApplication_tasksComponent, "f").setListing(new this.listMappings[option](__classPrivateFieldGet(this, _TodoApplication_tasks, "f")));
        this.redraw();
    }
    redraw() {
        __classPrivateFieldGet(this, _TodoApplication_tasksComponent, "f").drawOn(__classPrivateFieldGet(this, _TodoApplication_mainElement, "f"));
    }
}
_TodoApplication_tasks = new WeakMap(), _TodoApplication_mainElement = new WeakMap(), _TodoApplication_tasksComponent = new WeakMap();
const task = new Task(1, 'Example');
const taskList = new TaskList([task, new Task(1, 'Task 1'), new Task(2, 'Task 2'), new Task(4, 'Task 3'),]);
const app = new TodoApplication(taskList);
app.run();
(_a = document.getElementById('listing_switcher')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (event) => {
    const option = event.target.value;
    app.switchListing(option);
});
