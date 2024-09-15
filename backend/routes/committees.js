const express = require('express');

module.exports = function (committeesCollection) {
    const router = express.Router();

    // Define your committees routes here, for example:
    router.get('/', async (req, res) => {
        try {
            const committees = await committeesCollection.find().toArray();
            res.json(committees);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching committees', error });
        }
    });

    return router;
};
