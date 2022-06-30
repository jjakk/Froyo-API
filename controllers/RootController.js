const getRoot =  (req, res) => {
    res.status(200).send(req.user.id);
};

const getTakeout = async (req, res) => {
    res.send("In development");
};

module.exports = {
    getRoot,
    getTakeout
};