// Get the user's letter in a connection and returns in 2 character array
// The first letter is the user's letter, the second is the other user's letter

const getUserLetters = (userId, connection) => {
    // Checks the database for the user's letter in the connection
    const userLetter = (
        connection.user_a_id === userId
    ) ? 'a'
        : connection.user_b_id === userId
            ? 'b'
            : null;

    // Letter of the other user in the connection
    const otherLetter = userLetter === 'a' ? 'b' : 'a';

    return [userLetter, otherLetter];
};

module.exports = getUserLetters;