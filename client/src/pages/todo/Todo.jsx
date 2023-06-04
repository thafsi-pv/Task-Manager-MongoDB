import { useEffect, useRef, useState } from "react";
import "./Todo.css";
import { BsFillPencilFill, BsFillTrash3Fill, BsCircle } from "react-icons/bs";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { IoIosClose } from "react-icons/io";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  TODO_API,
  TODO_DELETECOMPLETED_API,
  TODO_FILTERLIST_API,
} from "../../constants/constants";

export const Todo = () => {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodo, setEditTodo] = useState("");
  const [editTodoId, setEditTodeId] = useState("");
  const [filterType, setFilterType] = useState("all");
  const inputRef = useRef(null);
  const inputEditRef = useRef(null);
  const todoListRef = useRef(null);
  const [itemLeft, setItemLeft] = useState();

  useEffect(() => {
    getTodoList();
    inputRef.current.focus();
  }, []);

  const getTodoList = async () => {
    const data = await axios(TODO_API);
    setTodoList(data?.data);
  };

  useEffect(() => {
    let count = todoList.filter((item) => item.isCompleted == false).length;
    setItemLeft(count);
  }, [todoList]);

  const handleAddTodo = async () => {
    try {
      if (newTodo) {
        const data = await axios(TODO_API, {
          method: "POST",
          data: {
            todo: newTodo,
            isCompleted: false,
          },
        });
        setTodoList((prev) => [data?.data, ...prev]);
        setNewTodo("");
        todoListRef.current.scrollTo({ top: 0, behavior: "smooth" });
        toast.success("Task added successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        // alert("An empty world is impossible!");
        toast.error("An empty world is impossible!");
      }
      inputRef.current.focus();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const todoIsCompleted = async (id) => {
    const currentTdodList = [...todoList];
    const index = currentTdodList.findIndex((item) => item._id == id);
    const data = await axios(TODO_API + "/isComplete", {
      method: "PUT",
      data: {
        id: id,
        isCompleted: !currentTdodList[index].isCompleted,
      },
    });
    if (data?.data) {
      currentTdodList[index].isCompleted = !currentTdodList[index].isCompleted;
      setTodoList(currentTdodList);

      if (currentTdodList[index].isCompleted == true) {
        toast.success("Task marked as completed successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.warning("Task marked as pending successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  };

  const todoDelete = async (id) => {
    const data = await axios(TODO_API, {
      method: "DELETE",
      data: { id },
    });
    if (data?.data) {
      const newList = todoList.filter((item) => item._id != id);
      console.log("🚀 ~ file: Todo.jsx:107 ~ todoDelete ~ newList:", newList);
      setTodoList(newList);
      toast.success("Task deleted successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleTodoEdit = async (id) => {
    setEditTodeId(id);
    const editTodoList = [...todoList];
    const index = editTodoList.findIndex((item) => {
      return item._id == id;
    });
    setEditTodo(editTodoList[index].todo);
    setTimeout(() => inputEditRef.current.focus(), 0);
  };

  const updateTodo = async () => {
    try {
      if (editTodo) {
        const data = await axios(TODO_API, {
          method: "PUT",
          data: {
            _id: editTodoId,
            todo: editTodo,
            isCompleted: false,
          },
        });
        setTodoList(data?.data);

        if (data?.data) {
          const currentTdodList = [...todoList];
          const index = currentTdodList.findIndex(
            (item) => item._id == editTodoId
          );
          currentTdodList[index].todo = editTodo;
          currentTdodList[index].isCompleted = false;
          setTodoList(currentTdodList);
          setEditTodeId("");
          toast.success("Task updated successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      } else alert("An empty world is impossible!..");
    } catch (error) {
      toast.error("🦄 Wow so easy!");
      console.log(error?.response?.data?.message);
    }
  };

  const clearCompleted = async () => {
    const data = await axios(TODO_DELETECOMPLETED_API, {
      method: "DELETE",
    });
    console.log("🚀 ~ file: Todo.jsx:206 ~ clearCompleted ~ data:", data);

    if (data?.data?.deletedCount > 0) {
      const newList = todoList.filter((item) => item.isCompleted != true);
      console.log("🚀 ~ file: Todo.jsx:206 ~ newList ~ newList:", newList);
      setTodoList(newList);
      setFilterType("all");
      toast.success("Removed " + data.data.deletedCount + " completed task", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleFilterlist = async (type) => {
    setFilterType(type);
    const data = await axios(TODO_FILTERLIST_API, {
      method: "POST",
      data: {
        type,
      },
    });
    setTodoList(data?.data);
  };

  return (
    <div className="todo-container">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="main-container">
        <div className="todo">
          <div className="todo-title">
            <p>Task Manager</p>
          </div>
          <div className="todo-add">
            <div className="add-input">
              <input
                type="text"
                placeholder="What needs to be done?"
                name="addnew"
                id=""
                ref={inputRef}
                value={newTodo}
                onChange={() => setNewTodo(event.target.value)}
              />
              {newTodo && (
                <span>
                  <IoIosClose
                    className="clear-icon"
                    onClick={() => {
                      setNewTodo("");
                      inputRef.current.focus();
                    }}
                  />
                </span>
              )}
            </div>
            <button onClick={() => handleAddTodo()}>ADD TASK</button>
          </div>
          <div className="todo-list" ref={todoListRef}>
            {todoList?.map((item) => (
              <div key={item.id} className="todo-item">
                {editTodoId != "" && editTodoId === item._id ? (
                  <div className="edit-todo">
                    <div className="edit-input">
                      <input
                        type="text"
                        name=""
                        id=""
                        ref={inputEditRef}
                        value={editTodo}
                        onChange={() => setEditTodo(event.target.value)}
                      />
                      {editTodo && (
                        <span>
                          <IoIosClose
                            className="clear-icon"
                            onClick={() => {
                              setEditTodo("");
                              setTimeout(() => inputEditRef.current.focus(), 0);
                            }}
                          />
                        </span>
                      )}
                    </div>
                    <div className="edit-action">
                      <button onClick={() => updateTodo(item.id)}>Save</button>
                      <button
                        className="btn-cancel"
                        onClick={() => setEditTodeId("")}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className="todo-name"
                      onClick={() => todoIsCompleted(item._id)}>
                      <span>
                        {item.isCompleted ? (
                          <AiOutlineCheckCircle className="check-icon" />
                        ) : (
                          <BsCircle className="uncheck-icon" />
                        )}
                      </span>
                      <p
                        className={
                          item.isCompleted
                            ? "item-title item-completed"
                            : "item-title"
                        }>
                        {item.todo}
                      </p>
                    </div>
                    <div className="item-action">
                      <BsFillPencilFill
                        className="action-edit"
                        onClick={() => handleTodoEdit(item._id)}
                      />
                      <BsFillTrash3Fill
                        className="action-delete"
                        onClick={() => todoDelete(item._id)}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="todo-footer">
            <div className="">
              <p>{itemLeft} Item left</p>
            </div>
            <div className="btn-filter">
              <p
                className={`${filterType === "all" ? "active" : ""}`}
                onClick={() => handleFilterlist("all")}>
                All
              </p>
              <p
                className={`${filterType === "active" ? "active" : ""}`}
                onClick={() => handleFilterlist("active")}>
                Active
              </p>
              <p
                className={`${filterType === "completed" ? "active" : ""}`}
                onClick={() => handleFilterlist("completed")}>
                Completed
              </p>
            </div>
            <div className="">
              <p className="clear-completed" onClick={() => clearCompleted()}>
                Clear Completed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
