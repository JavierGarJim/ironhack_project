class AddOptionsToTags < ActiveRecord::Migration
  def change
    add_column :tags, :for_comment, :boolean
    add_column :tags, :for_promo, :boolean
  end
end
