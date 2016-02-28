class ServiceController < ApplicationController
	before_action :authenticate_user!, :create_user

	def update
		user_info = []
		tweets = []

		if !current_user.last_request.nil? && current_user.last_request > 15.minutes.ago
			render json: {new: "false", update: current_user.last_update}

			return
		end

		puts "************************************************************************************"
		puts "************************************************************************************"
		puts "New Twitter request"

		unless current_user.tags.empty?
			current_user.tags.each do |tag|
				puts "SEARCH"
				puts tag.name

				results = @client.search(tag.name, result_type: "recent")

				results.each do |tweet|
					if find_tweet(tweets, tweet.attrs[:id_str]).nil? && tweet.attrs[:retweeted_status].nil?
						tweets.push(tweet.attrs[:id_str])

						if tag.for_retweet
							if tweet.attrs[:retweeted] == "false"
								@client.retweet(tweet)
							end
						end

						if tag.for_comment
							# @client.update("@#{reply_to.user.username} Not today.", in_reply_to_status_id: reply_to.id)
						elsif tag.for_promo

						end
					end
				end
			end
		else
			results = @client.home_timeline

			results.each do |tweet|
				if find_tweet(tweets, tweet.attrs[:id_str]).nil? && tweet.attrs[:retweeted_status].nil?
					tweets.push(tweet.attrs[:id_str])
				end
			end

			puts "HOME_TIMELINE"
		end

		user_info = @client.user

		puts "************************************************************************************"
		puts "************************************************************************************"

		if current_user.last_request.nil?
			current_user.first_update = get_info(user_info)
		end

		current_user.last_update = {initial_user: current_user.first_update, user: get_info(user_info), tweets: tweets}
		
		current_user.last_request = DateTime.now

		current_user.save

		render json: {new: "true", update: current_user.last_update}
	end

	def index

	end

	private
		def get_twitter_rest_client(identity)
	    	client = Twitter::REST::Client.new do |config|
	      		config.consumer_key = ENV["TWITTER_APP_ID"]
	      		config.consumer_secret = ENV["TWITTER_APP_SECRET"]
	      		config.access_token = identity.accesstoken
	      		config.access_token_secret = identity.secrettoken
	    	end

	    	client
		end

		def get_twitter_stream_client(identity)
	    	client = Twitter::Streaming::Client.new do |config|
	      		config.consumer_key = ENV["TWITTER_APP_ID"]
	      		config.consumer_secret = ENV["TWITTER_APP_SECRET"]
	      		config.access_token = identity.accesstoken
	      		config.access_token_secret = identity.secrettoken
	    	end

	    	client
		end

		def create_user
			@identity = current_user.identities.find_by(provider: "twitter")

			@client = get_twitter_rest_client(@identity)
		end

		def comment_params
			params.require(:comment).permit(:template)
		end

		def comment_params
			params.require(:comment).permit(:template)
		end

		def find_tweet(tweet_ids, tweet_id)
			unless tweet_ids.empty?
				tweet_ids.detect  {|id| id == tweet_id } 
			end
		end

		def get_info(user_info)
			{
				followers_count: user_info.followers_count,
				friends_count: user_info.friends_count,
				listed_count: user_info.listed_count,
				favourites_count: user_info.favourites_count
			}
		end
end
