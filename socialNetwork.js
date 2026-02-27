// Social Network Starter File
// Based on the README instructions
// Implement the functions below using the step-by-step guidance

// Data Structure: Adjacency list with details
const network = {
  smo: {
    details: { name: "Smo", city: "Toronto", bio: "", school: "", company: "" },
    friends: ["palvreet", "brian"]
  },
  palvreet: {
    details: { name: "Palvreet", city: "Toronto", bio: "Likes basketball", school: "", company: "" },
    friends: ["smo", "cory", "jasmine"]
  },
  cory: {
    details: { name: "Cory", city: "Montreal", bio: "", school: "", company: "" },
    friends: ["palvreet", "brian"]
  },
  brian: {
    details: { name: "Brian", city: "Toronto", bio: "", school: "", company: "" },
    friends: ["smo", "cory"]
  },
  jasmine: {
    details: { name: "Jasmine", city: "Toronto", bio: "", school: "", company: "" },
    friends: ["palvreet"]
  }
};

// Core Feature A — Add Friendship
function addFriendship(network, user1, user2) {
  if (!network[user1]) {
    network[user1] = { details: { name: user1, city: "", bio: "", school: "", company: "" }, friends: [] };
  }
  if (!network[user2]) {
    network[user2] = { details: { name: user2, city: "", bio: "", school: "", company: "" }, friends: [] };
  }

  var alreadyFriend = false;
  for (var i = 0; i < network[user1].friends.length; i++) {
    if (network[user1].friends[i] === user2) { alreadyFriend = true; break; }
  }
  if (!alreadyFriend) {
    network[user1].friends.push(user2);
  }

  alreadyFriend = false;
  for (var j = 0; j < network[user2].friends.length; j++) {
    if (network[user2].friends[j] === user1) { alreadyFriend = true; break; }
  }
  if (!alreadyFriend) {
    network[user2].friends.push(user1);
  }
}

// Core Feature B — Suggest Friends (Friends-of-Friends)
function suggestFriends(network, personId) {
  if (!network[personId]) return [];

  var counts = {};
  var direct = network[personId].friends;

  for (var i = 0; i < direct.length; i++) {
    var friendId = direct[i];
    if (!network[friendId]) continue;
    var friendsOfFriend = network[friendId].friends;
    for (var j = 0; j < friendsOfFriend.length; j++) {
      var candidate = friendsOfFriend[j];
      if (candidate === personId) continue;

      var isDirect = false;
      for (var k = 0; k < direct.length; k++) {
        if (direct[k] === candidate) { isDirect = true; break; }
      }
      if (isDirect) continue;

      if (!counts[candidate]) counts[candidate] = 0;
      counts[candidate] = counts[candidate] + 1;
    }
  }

  var result = [];
  for (var id in counts) {
    if (Object.prototype.hasOwnProperty.call(counts, id)) {
      result.push({ id: id, mutualCount: counts[id] });
    }
  }

  result.sort(function(a, b) { return b.mutualCount - a.mutualCount; });
  return result;
}

// Core Feature C — People You May Know (Filters)
function peopleYouMayKnow(network, personId, options) {
  if (!network[personId]) return [];
  options = options || {};
  var minMutual = options.minMutualFriends || 0;
  var sameCityOnly = !!options.sameCityOnly;
  var excludeList = options.excludeList || [];

  var suggestions = suggestFriends(network, personId);
  var filtered = [];

  for (var i = 0; i < suggestions.length; i++) {
    var cand = suggestions[i];
    if (cand.mutualCount < minMutual) continue;

    if (sameCityOnly) {
      var userCity = (network[personId] && network[personId].details && network[personId].details.city) || "";
      var candCity = (network[cand.id] && network[cand.id].details && network[cand.id].details.city) || "";
      if (userCity !== candCity) continue;
    }

    var excluded = false;
    for (var j = 0; j < excludeList.length; j++) {
      if (excludeList[j] === cand.id) { excluded = true; break; }
    }
    if (excluded) continue;

    filtered.push(cand);
  }

  filtered.sort(function(a, b) { return b.mutualCount - a.mutualCount; });
  return filtered;
}

// Core Feature D — Profile Completeness
function profileCompleteness(network, personId) {
  if (!network[personId]) return 0;
  var score = 0;
  var details = network[personId].details || {};

  if (details.name && details.name !== "") { score += 20; }
  if (details.city && details.city !== "") { score += 20; }
  if (details.bio && details.bio !== "") { score += 20; }
  if ((details.school && details.school !== "") || (details.company && details.company !== "")) { score += 20; }

  var friendsCount = (network[personId].friends && network[personId].friends.length) || 0;
  if (friendsCount >= 3) { score += 20; }

  return score;
}

// Example usage (uncomment to test)
console.log("Initial network:", network);
addFriendship(network, "smo", "cory");
console.log("After adding friendship:", network);
console.log("Suggestions for smo:", suggestFriends(network, "jasmine"));
console.log("Filtered suggestions:", peopleYouMayKnow(network, "brian", { minMutualFriends: 2, sameCityOnly: true }));
console.log("Profile completeness for smo:", profileCompleteness(network, "palvreet"));