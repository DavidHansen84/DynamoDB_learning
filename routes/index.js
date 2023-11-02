var express = require('express');
var router = express.Router();

const CyclicDB = require('@cyclic.sh/dynamodb')
const db = CyclicDB(process.env.CYCLIC_DB)
let contentCollection = db.collection('content')

router.get("/", async (req, res, next) => {
  let content = await contentCollection.get("content")

  if (content == null) {
    res.json({
      status: "fail",
      message: "Content is empty, add some content first"
    });
  } else {
    let contentValue = content.props.value
    res.json({
      status: "success",
      result: contentValue,
    });
  }
});

router.post("/", async (req, res, next) => {
  const { content } = req.body;
  if (content == null) {
    res.status(400).send("Content not provided");
    return;
  }
  await contentCollection.set("content", {
    value: content
  })
  res.json({
    status: "success",
    content: content,
  });
});

module.exports = router;
