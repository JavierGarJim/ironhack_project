class ServiceController < ApplicationController
	before_action :authenticate_user!, :create_user

	def update
		puts "************************************************************************************"
		puts "************************************************************************************"

		user_info = []
		tweets = []

		if !current_user.last_request_time.nil? && current_user.last_request_time > 15.minutes.ago.utc
			puts "*** Too early for a new Twitter request!"
			puts "*** Current time: " + Time.now.utc.to_s
			puts "*** Last request time: " + current_user.last_request_time.to_s

			puts "************************************************************************************"
			puts "************************************************************************************"

			render json: build_response("old")

			return
		end

		puts "New Twitter request"

		unless current_user.tags.empty?
			current_user.tags.each do |tag|
				puts "*** SEARCH"
				puts tag.name

				results = @client.search(tag.name, result_type: "recent")

				max_api_calls = 10

				results.each do |tweet|
					if find_tweet(tweet.attrs[:id_str]).nil?
						current_user.tweets.create({id_str: tweet.attrs[:id_str]})

						if tweet.attrs[:retweeted_status].nil?
							if tag.for_retweet
								puts "*** For retweet"
								puts "*** retweeted: " + tweet.attrs[:retweeted].to_s

								if tweet.attrs[:retweeted] == "false"
									if max_api_calls > 0
										@client.retweet(tweet)

										max_api_calls -= 1

										puts "*** Retweeted!"
									end
								end
							end
						end
						
						if tag.for_comment
							puts "*** For comment"

							puts tweet.attrs[:user][:screen_name]

							comment = current_user.comments.order("RANDOM()")[0]

							if max_api_calls > 0
								@client.update("Hi @#{tweet.attrs[:user][:screen_name]}, #{comment.template}", in_reply_to_status_id_str: tweet.attrs[:id_str])

								max_api_calls -= 1

								puts "*** Commmented!"
							end
						elsif tag.for_promo
							puts "*** For promo"

							if max_api_calls > 0
								# @client.update("Hi @#{tweet.attrs[:user][:screen_name]}, #{comment.template}", in_reply_to_status_id_str: tweet.attrs[:id_str])

								max_api_calls -= 1

								puts "*** Promoted!"
							end
						end
					end
				end
			end
		else
			results = @client.home_timeline

			results.each do |tweet|

puts "#############"
puts find_tweet(tweet.attrs[:id_str])
puts "#############"

				if find_tweet(tweet.attrs[:id_str]).nil? && tweet.attrs[:retweeted_status].nil?

puts "-----------------------"
					current_user.tweets.create({id_str: tweet.attrs[:id_str]})
				end
			end

			puts "*** HOME_TIMELINE"
		end

		user_info = @client.user

		if current_user.last_request_time.nil?
			current_user.initial_followers_count = user_info.attrs[:followers_count]
    		current_user.initial_friends_count = user_info.attrs[:friends_count]
			current_user.initial_listed_count = user_info.attrs[:listed_count]
	    	current_user.initial_favourites_count = user_info.attrs[:favourites_count]
		end

		current_user.followers_count = user_info.attrs[:followers_count]
    	current_user.friends_count = user_info.attrs[:friends_count]
		current_user.listed_count = user_info.attrs[:listed_count]
    	current_user.favourites_count = user_info.attrs[:favourites_count]
		
		current_user.last_request_time = DateTime.now.new_offset(0)

		current_user.save

		puts "************************************************************************************"
		puts "************************************************************************************"

		render json: build_response("new")
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

		def find_tweet(id_str)
			current_user.tweets.detect  {|t| t.id_str == id_str }
		end

		def get_info(user_info)
			{
				followers_count: user_info.followers_count,
				friends_count: user_info.friends_count,
				listed_count: user_info.listed_count,
				favourites_count: user_info.favourites_count
			}
		end

		def build_response(status)
			response = {
				status: status,
				user: { 
					initial_followers_count: current_user.initial_followers_count,
    				initial_friends_count: current_user.initial_friends_count,
	    			initial_listed_count: current_user.initial_listed_count,
	    			initial_favourites_count: current_user.initial_favourites_count,
	    			followers_count: current_user.followers_count,
	    			friends_count: current_user.friends_count,
					listed_count: current_user.listed_count,
	    			favourites_count: current_user.favourites_count },
	    		tweets: []
			}

			current_user.tweets.last(20).each do |t|
				response[:tweets].push({id_str: t.id_str})
			end

			return response
		end
end
