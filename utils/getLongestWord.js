const getLongestWord = (text) => {
  const words = text.split(" ");
  let longestWord = words[0];
  for(word of words){
    if(word.length > longestWord.length){
      longestWord = word;
    }
  }
  return longestWord;
}

module.exports = getLongestWord;
