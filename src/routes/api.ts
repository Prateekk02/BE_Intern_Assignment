import express from "express"

const router = express.Router();

router.get('/log', (req,res)=>{
    res.json({status: "Running"});
})

module.exports = router;