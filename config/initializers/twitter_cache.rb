
Twitter::Cache.configure do |config|
	config.redis = ENV['REDIS_URL']
  	config.ttl = 60 * 30                     # sec
  	config.namespace = '#ilabs'               # default: twitter-cache-gem
  	# config.user_instance do |raw|
   #  	User.new(id: raw.id, nickname: raw.screen_name,
   #           image: raw.profile_image_url_https.to_s)
   #  end
end