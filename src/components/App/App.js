import { Component } from "react";
import Footer from "../Footer/Footer";
import NewTaskForm from "../NewTaskForm/NewTaskForm";
import TaskList from "../TaskList/TaskList";
import "./App.css";
import { formatDistanceToNow } from "date-fns";
export default class App extends Component {
  newId = 1;

  state = {
    todoData: [],
    filter: "All",
    todoFiltered: [],
  };

  createEl(label) {
    let date = new Date();
    const time = formatDistanceToNow(date, { addSuffix: true });
    return {
      label: label,
      id: this.newId++,
      date: time,
      done: false,
      edit: false,
    };
  }

  addTask = (label) => {
    this.setState(({ todoData }) => {
      const newTodoData = JSON.parse(JSON.stringify(todoData));
      const newItem = this.createEl(label);
      newTodoData.push(newItem);
      return {
        todoData: newTodoData,
      };
    });
  };

  deleteTask = (id) => {
    this.setState(({ todoData }) => {
      const indx = todoData.findIndex((el) => el.id === id);
      const newTodoData = JSON.parse(JSON.stringify(todoData));
      newTodoData.splice(indx, 1);
      return {
        todoData: newTodoData,
      };
    });
  };

  onToggleDone = (id) => {
    this.setState(({ todoData }) => {
      const newTodoData = JSON.parse(JSON.stringify(todoData));
      const indx = todoData.findIndex((el) => el.id === id);
      const data = newTodoData[indx];
      data.done = !data.done;
      return {
        todoData: newTodoData,
      };
    });
  };

  editing = (id) => {
    this.setState(({ todoData }) => {
      const newTodoData = JSON.parse(JSON.stringify(todoData));
      const indx = todoData.findIndex((el) => el.id === id);
      const oldData = newTodoData[indx];
      oldData.edit = !oldData.edit;
      return {
        todoData: newTodoData,
      };
    });
  };

  finishEditing = (id, value) => {
    this.setState(({ todoData }) => {
      const newTodoData = JSON.parse(JSON.stringify(todoData));
      const indx = todoData.findIndex((el) => el.id === id);
      const data = newTodoData[indx];
      data.label = value;
      data.edit = false;
      return {
        todoData: newTodoData,
      };
    });
  };

  changeFilter = (value) => {
    this.setState({ filter: value });
    // this.setState(({ todoData, filter, todoFiltered }) => {
    //   const all = filter === "All";
    //   const completed = filter === "Completed";
    //   return {
    //     todoFiltered: todoData.filter(({ done }) => {
    //       return all ? true : completed ? done === true : done === false;
    //     }),
    //   };
    // });
  };

  deleteCompleted = () => {
    this.setState(({ todoData }) => {
      const newTodoData = JSON.parse(JSON.stringify(todoData)).filter(
        (el) => !el.done
      );
      return {
        todoData: newTodoData,
      };
    });
  };

  render() {
    const { todoData, filter } = this.state;
    const counterLeft =
      todoData.length - todoData.filter((el) => el.done).length;
    let todoItemsShown;

    switch (filter) {
      case "Completed":
        todoItemsShown = todoData.filter((elem) => elem.done);
        break;
      case "Active":
        todoItemsShown = todoData.filter((elem) => !elem.done);
        break;
      default:
        todoItemsShown = todoData;
    }

    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <NewTaskForm addTask={this.addTask} />
        </header>
        <section className="main">
          <TaskList
            todos={todoItemsShown}
            onDeleted={(id) => this.deleteTask(id)}
            onToggleDone={this.onToggleDone}
            editing={this.editing}
            finishEditing={this.finishEditing}
          />
          <Footer
            counterLeft={counterLeft}
            onClear={this.deleteCompleted}
            onChangeFilter={this.changeFilter}
            filter={this.state.filter}
          />
        </section>
      </section>
    );
  }
}