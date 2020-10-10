const axios = require('axios');

const fetchQuote = async (URL, PORT, id) => {
    const res = await axios.get(`${URL}:${PORT}/quote`, {
        params: {
            id: id
        }
    });
    return res.data;
};


module.exports = {
    fetchQuote
};
