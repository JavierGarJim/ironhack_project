class RemoveForPromoFromTags < ActiveRecord::Migration
  def change
    remove_column :tags, :for_promo, :boolean
  end
end
