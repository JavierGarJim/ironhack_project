class WelcomeController < ApplicationController
	def contact
		if params[:name] == "" || !ValidateEmail.valid?(params[:email]) || params[:message] == ""
			flash.now[:error] = 'contact_error'
			
			render 'index'

			return
		end

		flash.now[:notice] = 'contact_success'

		AdminMailer.new_contact(params[:name], params[:email], params[:message]).deliver_now

		@contact_name = params[:name]

		render 'index'
	end

	def signed_up
		render 'index'
	end

# 	def sign_up
# 		render 'index'
# 	end
end
