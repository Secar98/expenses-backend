const express = require("express");
const ExpenseModel = require("../models/expense");
const UserModel = require("../models/user");
const { verify } = require("../middlewear");
const {
  validateIsNumber,
  validateIsString,
  validateIsDate,
} = require("../utils/expense-validation");
const router = express.Router();

router.get("/get", verify, (req, res) => {
  const id = req.user;
  UserModel.findOne({ _id: id })
    .populate({ path: "expenses", populate: { path: "expenses" } })
    .exec((error, user) => {
      if (error) {
        res
          .status(500)
          .json({ msg: "Something went wrong with fetching expenses" });
      }
      const { expenses } = user;
      res.status(200).json({ data: expenses });
    });
});

router.post("/add", verify, (req, res) => {
  const { title, amount } = req.body;
  const date = new Date(req.body.date);
  const id = req.user;

  if (!validateIsString(title)) {
    res.status(400).json({ msg: "Title must be a string" });
  } else if (!validateIsNumber(amount)) {
    res.status(400).json({ msg: "Amount must be a number" });
  } else if (!validateIsDate(date)) {
    res.status(400).json({ msg: "Date must be a date-string" });
  } else {
    const newExpense = ExpenseModel({
      title: title,
      amount: amount,
      date: date,
      author: id,
    });
    newExpense
      .save()
      .then((expense) => {
        UserModel.updateOne(
          { _id: id },
          { $push: { expenses: expense._id } },
          (error) => {
            if (error) {
              console.log(error);
            }
          }
        );
        res.status(200).json({ msg: expense._id });
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  }
});

router.delete("/delete", verify, (req, res) => {
  const userId = req.user;
  const { id } = req.body;

  UserModel.updateOne(
    { _id: userId },
    { $pull: { expenses: id } },
    (error, expense) => {
      if (error) {
        console.log(error);
      }
    }
  ).catch((error) => {
    res.status(500).json(error);
  });

  ExpenseModel.deleteOne({ _id: id }, (error) => {
    if (error) {
      console.log(error);
    }
  }).catch((error) => {
    res.status(500).json(error);
  });

  res.status(200).json({ msg: "deleted expense" });
});

module.exports = router;
