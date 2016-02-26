class CommentsController < ApplicationController
	# before_action :authenticate_user!
	skip_before_filter :verify_authenticity_token  

	def index
		comments = current_user.comments.all
		
		render json: comments
	end

	def create
puts "-------------------------"
		if current_user.comments.find_by(template: params[:template])

			render json: {error: "comment already found"},
			status: 404

			return
		else
			comment = current_user.comments.create(comment_params)
		
			render json: comment
		end
	end

	def destroy
		comment = current_user.comments.find_by(id: params[:id])

		unless comment
			render json: {error: "comment not found"},
			status: 404
			return
		end

		comment.destroy

		render json: comment
	end

	def update
		comment = current_user.comments.find_by(id: params[:id])

		unless comment
			render json: {error: "comment not found"},
			status: 404
			return
		end

		comment.update(comment_params)

		render json: comment
	end

	private
		def comment_params
			params.permit(:template)
		end
end
