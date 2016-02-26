class PromotionsController < ApplicationController
	# before_action :authenticate_user!
	skip_before_filter :verify_authenticity_token  

	def index
		promotions = current_user.promotions.all
		
		render json: promotions
	end

	def create
		promotion = current_user.promotions.create(promotion_params)
		
		render json: commment
	end

	def destroy
		promotion = current_user.promotions.find_by(id: params[:id])

		unless promotion
			render json: {error: "promotion not found"},
			status: 404
			return
		end

		promotion.destroy

		render json: promotion
	end

	def update
		promotion = current_user.promotions.find_by(id: params[:id])

		unless promotion
			render json: {error: "promotion not found"},
			status: 404
			return
		end

		promotion.update(promotion_params)

		render json: promotion
	end

	private
		def promotion_params
			params.permit(:template)
		end
end
