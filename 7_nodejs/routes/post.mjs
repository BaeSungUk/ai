import express from "express"

const router = express.Router()

router.get("/", (req, res) => {
    res.status(200).send("GET: /posts 글 보기")
})
router.post("/", (req, res) => {
    res.status(201).send("POST: /posts 글 작성하기")
})
router.put("/:id", (req, res) => {
    res.status(201).send("PUT: /posts/:id 글 수정하기")
})
router.delete("/:id", (req, res) => {
    res.status(200).send("DELETE: /posts/:id 글 삭제하기")
})

export default router
