class WelcomeController < ApplicationController
	def contact
		AdminMailer.new_contact(params[:name], params[:email], params[:message]).deliver_now

		@contact_name = params[:name]

		render 'index'
	end

	def signed_up
		user = User.last

		if user.approved.nil?
			@username = user.identities.find_by(provider: 'twitter').nickname
		end

		render 'index'
	end

# 	def sign_up
# 		render 'index'
# 	end
end
