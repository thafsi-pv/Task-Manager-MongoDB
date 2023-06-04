const express = require("express");
const todo = require("../models/todoModel");

const todoRouter = express.Router();

todoRouter.get("/", async (req, res) => {
  try {
    const todos = await todo.find().sort({ createdAt: "desc" });
    res.json(todos);
  } catch (error) {
    res.status(400).json({ messge: error.messge });
  }
});

todoRouter.post("/", async (req, res) => {
  try {
    const response = await todo.create(req.body);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

todoRouter.put("/", async (req, res) => {
  console.log("🚀 ~ file: todo.js:25 ~ todoRouter.put ~ req:", req.body);
  try {
    const { _id, todo: newTodo, isCompleted } = req.body;
    const fieldsToUpdate = {
      todo: newTodo,
      isCompleted,
    };

    const updatedData = await todo.findByIdAndUpdate(_id, fieldsToUpdate, {
      new: true,
    });

    if (updatedData) {
      res.json(updatedData);
    }
  } catch (error) {}
});

todoRouter.delete("/", async (req, res) => {
  try {
    const { id } = req.body;
    const deletedItem = await todo.findByIdAndDelete(id);
    if (deletedItem) {
      res.json(deletedItem);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

todoRouter.put("/isComplete", async (req, res) => {
  console.log("🚀 ~ file: todo.js:56 ~ todoRouter.patch ~ req:", req.body);
  try {
    const { id, isCompleted } = req.body;
    const newdt = await todo.findByIdAndUpdate(
      id,
      { isCompleted: isCompleted },
      { new: true }
    );
    if (newdt) {
      res.json(newdt);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

todoRouter.delete("/deleteCompleted", async (req, res) => {
  try {
    const count = await todo.deleteMany({ isCompleted: true });
    console.log(
      "🚀 ~ file: todo.js:75 ~ todoRouter.delete ~ count:",
      count.deletedCount
    );
    res.json(count);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

todoRouter.post("/filterList",async (req, res) => {
  try {
    console.log("🚀 ~ file: todo.js:88 ~ todoRouter.get ~ type:", req.body)
    const { type } = req.body;
    if (type == "all") {
      const list = await todo.find({}).sort({ createdAt: "desc" });
      res.json(list);
    } else if (type == "active") {
      const list = await todo.find({ isCompleted: false });
      console.log("🚀 ~ file: todo.js:94 ~ todoRouter.post ~ list:", list)
      res.json(list);
    } else if (type == "completed") {
      const list = await todo.find({ isCompleted: true });
      res.json(list);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = todoRouter;
