class AdminMailer < ApplicationMailer
	
	def new_user_waiting_for_approval(user_id)
		@user_id = user_id

    	mail(:to => 'hashilabs@gmail.com', subject: 'New User signed up!')
    end

    def new_contact(name, email, message)
    	@name = name
    	@message = message
    	
		mail(:to => email, subject: 'New Contact!')
    end
end
