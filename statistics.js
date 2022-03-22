
function getMostMentioned(comments) {
	let mentions = {};
	for (comment of comments) {
		if (comment.mentions === null) {
			continue;
		}
		for (mention of comment.mentions) {
			if (mentions[mention] === undefined) {
				mentions[mention] = {
					count: 1,
					spam_count: 1,
					users: [comment.user]
				}
			} else {
				if (!mentions[mention].users.includes(comment.user)) {
					mentions[mention].count ++;
					mentions[mention].users.push(comment.user);
				}
				mentions[mention].spam_count ++;
			}
		}
	}

	// Transform the mentions dictionary into an 
	let pairs = Object.keys(mentions).map((key) => { return [key, mentions[key]] });
	mentionPairs.sort((lhs, rhs) => {
		return lhs[1].count - rhs[1].count;
	})
	var keys = mentionPairs.map((e) => { return e[0] });
	console.log(keys);
	console.log(mentions);
	console.log(comments);
}