
const Timeline = require("../models/timeLineSchema");
const ErrorHandler = require("../utils/utilities");

const postTimeline = async (req, res, next) => {
    try {


        const { title, description, from, to } = req.body;
        const newTimeline = await Timeline.create({
            title,
            description,
            timeline: { from, to },
        });
        console.log(newTimeline)
        res.status(200).json({
            success: true,
            message: "Timeline Added!",
            newTimeline,
        });
    } catch (error) {
        console.log(error)
        next(error)
    }

};

const deleteTimeline = async (req, res, next) => {
    try {


        const { id } = req.params;
        let timeline = await Timeline.findById(id);
        if (!timeline) {
            return next(new ErrorHandler("Timeline not found", 404));
        }
        await timeline.deleteOne();
        res.status(200).json({
            success: true,
            message: "Timeline Deleted!",
        });
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getAllTimelines = async (req, res, next) => {
    try{

    const timeline = await Timeline.find();
    res.status(200).json({
        success: true,
        timeline,
    });
    }catch(error)
    {
        console.log(error)
        next(error) 
    }

};

module.exports = { postTimeline, deleteTimeline, getAllTimelines }