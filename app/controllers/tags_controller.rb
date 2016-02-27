class TagsController < ApplicationController
	before_action :authenticate_user!
	protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }
	

	def index
		tags = current_user.tags.all
		
		render json: tags
	end

	def create
		if current_user.tags.find_by(name: params[:name])

			render json: {error: "tag name already found"},
			status: 404

			return
		else
			tag = current_user.tags.create(tag_params)
		
			render json: tag
		end
	end

	def destroy
		tag = current_user.tags.find_by(id: params[:id])

		unless tag
			render json: {error: "tag not found"},
			status: 404
			return
		end

		tag.destroy

		render json: tag
	end

	def update
		tag = current_user.tags.find_by(id: params[:id])

		unless tag
			render json: {error: "tag not found"},
			status: 404
			return
		end

		tag.update(tag_params)

		render json: tag
	end

	private
		def tag_params
			params.permit(:name, :for_retweet, :for_comment, :for_promo)
		end
end
