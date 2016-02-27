class PromotionsController < ApplicationController
	before_action :authenticate_user!
	protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }


	def index
		promotions = current_user.promotions.all
		
		render json: promotions
	end

	def create
		if current_user.promotions.find_by(template: params[:template])

			render json: {error: "promotion already found"},
			status: 404

			return
		else
			promotion = current_user.promotions.create(promotion_params)
		
			render json: promotion
		end
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
