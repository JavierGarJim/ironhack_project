class AddRetweetOptionToTags < ActiveRecord::Migration
  def change
    add_column :tags, :for_retweet, :boolean
  end
end
