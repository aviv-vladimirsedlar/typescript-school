// Note how the TaskInput isn't necessary once there is a TaskListComponent in place, let's
//    leave it in for now
import { TaskList, Task, TaskListComponent, TasksComponent, KanbanComponent } from './task.js'

type listingOption = 'list' | 'kanban'
class TodoApplication {
  #tasks: TaskList
  #mainElement: HTMLElement

  listMappings = {
    'list': TaskListComponent, 'kanban': KanbanComponent
  }
  #tasksComponent: TasksComponent

  constructor(tasks: TaskList) {
    this.#tasks = tasks
    this.#mainElement = document.getElementById('todo_list') || new HTMLElement
    this.#tasksComponent = new TasksComponent(this.#tasks, new KanbanComponent(taskList))
  }

  run() {
    this.redraw()
  }

  switchListing(option: listingOption) {
    // !ONLY works because both listing components have the same contstructor arguments
    // Would be better to have a factory for creating listings

    this.#tasksComponent.setListing(new this.listMappings[option](this.#tasks))
    this.redraw()
  }

  redraw() {
    this.#tasksComponent.drawOn(this.#mainElement)
  }
}

const task = new Task(1, 'Example')
const taskList = new TaskList([task, new Task(1, 'Task 1'), new Task(2, 'Task 2'), new Task(4, 'Task 3'),])

const app = new TodoApplication(taskList)

app.run()

document.getElementById('listing_switcher')?.addEventListener('click', (event) => {
  const option = (event.target as HTMLButtonElement).value as listingOption
  app.switchListing(option)
})

