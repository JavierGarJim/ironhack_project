class AddNewStatsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :initial_followers_count, :integer
    add_column :users, :initial_friends_count, :integer
    add_column :users, :initial_listed_count, :integer
    add_column :users, :initial_favourites_count, :integer
    add_column :users, :followers_count, :integer
    add_column :users, :friends_count, :integer
    add_column :users, :listed_count, :integer
    add_column :users, :favourites_count, :integer
    add_column :users, :last_request_time, :datetime
  end
end
