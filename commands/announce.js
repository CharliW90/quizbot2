exports.run = async (message, args, announcement_title, announcement_content) => {
    try {
        const quizTeamChannels = message.guild.channels.cache.find(CategoryChannel => CategoryChannel.name == "Quiz Teams").children;
	
	if (!!announcement_title) {
	    quizTeamChannels.forEach(channel => {
                if (channel.type == 'text') {
                    try {
		        channel.send("Here is " + announcement_title);
			channel.send(announcement_content);
		    } catch (e) {
		        throw e;
		    };
                }
            });
	} else {
	    let announcement = args.join(' ');
            quizTeamChannels.forEach(channel => {
                if (channel.type == 'text') {
                    try {
		        channel.send(announcement);
		    } catch (e) {
		        throw e;
		    }
                }
            });
	}
    } catch (e) {
        throw e;
    }
}
