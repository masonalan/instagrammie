
function getMostMentioned(comments, topN) {
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
	pairs.sort((lhs, rhs) => {
		return rhs[1].count - lhs[1].count;
	})
	let sortedMentions = [];
	let keys = pairs.map((e) => { return e[0] });
	for (let i = 0; i < topN && i < keys.length; i ++) {
		let key = keys[i];
		sortedMentions.push({
			...mentions[key],
			key: key
		});
	}
	return sortedMentions;
}

module.exports = {
	getMostMentioned
}