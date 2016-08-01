//=======Miranda's Brain=========//

var util = require('util');

module.exports = {
	think: function(chat, user) {
		var hellos = /(hey|hi|hello)\b/i;
		var greeting = util.format("Hello %s! My name is Miranda. It's a " +
			"pleasure to meet you :)", user.first_name);
		if (hellos.exec(chat) !== null) {
			return greeting;
		} else if (chat === 'pizza') {
			return "Trevor is soon going to teach me how to order pizza.";
		} else {
            return "I'm sorry, I'm very young and don't understand what you're saying :(";
        }
	}
};
