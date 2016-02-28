class RemoveForRetweetFromUsers < ActiveRecord::Migration
  def change
    remove_column :users, :for_retweet, :boolean
  end
end
