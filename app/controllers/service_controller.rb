class ServiceController < ApplicationController
	before_action :authenticate_user!, :create_user

	def update
		@tweets = []#@cache.friends
puts "------"
puts "UPDATE"
puts "------"
		
		render json: @tweets
	end

	def index
		@tweets = [1, 2, 3, 4, 5]#@client.search("ironhack", result_type: "recent")
		# @user = @client.user

		# render json: @user

		# render json: @tweets
		# @tweets = []
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
end
