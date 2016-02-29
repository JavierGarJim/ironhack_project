class AddPromotionIdToTags < ActiveRecord::Migration
  def change
    add_reference :tags, :promotion, index: true, foreign_key: true
  end
end
