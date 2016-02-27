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
		puts "New Twitter request!"
		puts "************************************************************************************"
		puts "************************************************************************************"


		user_info = @client.user

		unless current_user.tags.empty?
			current_user.tags.each do |tag|
				# tweets = @client.search(tag.name, result_type: "recent", count: 3)

				if tag.for_comment

				elsif tag.for_promo

				end


			end
		else
			tweets = @client.home_timeline.take(5)
		end

		if current_user.last_request.nil?
			current_user.first_update = user_info
		end

		current_user.last_update = {initial_user: current_user.first_update, user: user_info, tweets: tweets}
		
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

			# @cache = Twitter::Cache.new(@client)
		end

	  	def find_tweets
			# @stream_client = get_twitter_stream_client(@identity)

			@tweets = []
			# @tweets = @client.home_timeline

			# topics = ["Pink Floyd", "The Beatles"]
			# contador = 0
			# @tweets = []

			# @stream_client.filter(:track => topics.join(",")) do |object|
			# 	contador += 1
			# 	if contador > 2
			# 		break
		 #  		else
		 #  			puts object.text if object.is_a?(Twitter::Tweet)
		 #  			puts contador 
		 #  			@tweets.push object if object.is_a?(Twitter::Tweet)
		 #  			#@tweets = object.text if object.is_a?(Twitter::Tweet)
		 #  		end
		 #  	end
  		end

		def comment_params
			params.require(:comment).permit(:template)
		end

		def comment_params
			params.require(:comment).permit(:template)
		end
end
