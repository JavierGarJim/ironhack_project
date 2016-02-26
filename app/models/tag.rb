class Tag < ActiveRecord::Base
	belongs_to :user
	has_many :comments, through: :uses, foreign_key: :comment_id
	has_many :promotions, through: :uses, foreign_key: :promotion_id
end
