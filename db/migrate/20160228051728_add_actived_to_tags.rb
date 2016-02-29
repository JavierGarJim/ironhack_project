class AddActivedToTags < ActiveRecord::Migration
  def change
    add_column :tags, :actived, :boolean
  end
end
