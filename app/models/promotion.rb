class Promotion < ActiveRecord::Base
	belongs_to :user
	has_many :tags
end
