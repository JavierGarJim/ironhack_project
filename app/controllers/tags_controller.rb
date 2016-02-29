class TagsController < ApplicationController
	before_action :authenticate_user!
	protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }
	

	def new
		render json: {comments: current_user.comments, promotions: current_user.promotions}
	end

	def index
		tags = current_user.tags.all
		
		render json: tags.to_json(include: [:comment, :promotion])
	end

	def create
		if current_user.tags.find_by(name: params[:name])

			render json: {error: "tag name already found"},
			status: 404
			return
		else
			if params[:comment_id] && params[:comment_id] != "none"
				unless current_user.comments.find_by(id: params[:comment_id])
					render json: {error: "comment id not found"},
					status: 404
					return
				end
			end

			if params[:promotion_id] && params[:promotion_id] != "none"
				unless current_user.promotions.find_by(id: params[:promotion_id])
					render json: {error: "promotion id not found"},
					status: 404
					return
				end
			end

			tag = current_user.tags.new

			tag.name = tag_params[:name]
			tag.for_retweet = tag_params[:for_retweet]

			if params[:comment_id] && params[:comment_id] != "none"
				tag.comment_id = tag_params[:comment_id]
			end

			if params[:promotion_id] && params[:promotion_id] != "none"
				tag.promotion_id = tag_params[:promotion_id]
			end
			
			tag.actived = tag_params[:actived]

			tag.save

			render json: tag.to_json(include: [:comment, :promotion])
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

		render json: tag.to_json(include: [:comment, :promotion])
	end

	def update
		tag = current_user.tags.find_by(id: params[:id])
puts "------------"
puts params.to_yaml
# puts tag.to_yaml
puts "------------"
		unless tag
			render json: {error: "tag not found"},
			status: 404
			return
		end

		tag.name = tag_params[:name]
		tag.for_retweet = tag_params[:for_retweet]

		if params[:comment_id] && params[:comment_id] != "none"
			tag.comment_id = tag_params[:comment_id]
		else
			tag.comment_id = nil
		end

		if params[:promotion_id] && params[:promotion_id] != "none"
			tag.promotion_id = tag_params[:promotion_id]
		else
			tag.promotion_id = nil
		end
		
		tag.actived = tag_params[:actived]

		tag.save

		render json: tag.to_json(include: [:comment, :promotion])
	end

	private
		def tag_params
			params.permit(:name, :for_retweet, :comment_id, :promotion_id, :actived)
		end
end
