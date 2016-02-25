module ApplicationHelper
	def current_identity
		current_user.identities.first
	end
end
