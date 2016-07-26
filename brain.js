//=======Miranda's Brain=========//

module.exports = {
    think: function(chat) {
        var hellos = ['hello', 'hi', 'hey'];
        var greeting = "Hello there! My name is Miranda. It's a pleasure" +
            " to meet you :)";
        if (hellos.indexOf(chat) > -1) {
            return greeting;
        }
        return "I'm sorry, I'm very young and don't understand what you're saying :("
    }
};
