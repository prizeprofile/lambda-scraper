const Tweet = require('./tweet/Tweet')
const TweetValidator = require('./tweet/TweetValidator')

module.exports = class Parser {
  /**
   * Class @constructor.
   *
   * @param {number} region
   * @param {ParserModule[]}
   */
  constructor (modules, region) {
    this.modules = modules

    this.region = region
  }

  /**
   * Pipes data from Twitter to Parser.
   *
   * @param {object} data
   * @return {void}
   */
  pipe (data) {
    let validator = new TweetValidator()

    const tweet = new Tweet(validator).from(data)

    if (!tweet.isTweet()) {
      return null
    }
    
    // Runs all the modules that parse data from the tweet.
    return this.runModules(tweet)
  }

  /**
   * Passes the competition through all registered modules.
   *
   * @param {Tweet} competition
   * @return {Promise<Tweet>}
   */
  runModules (competition) {
    return this.modules.reduce((chain, ParserModule) => {
      // Runs every module. Each time the module calls next with a data,
      // that data is passed to the next module as carry.
      return chain.then(data => {
        return new ParserModule(data).run()})
    }, Promise.resolve(competition))
  }
}
