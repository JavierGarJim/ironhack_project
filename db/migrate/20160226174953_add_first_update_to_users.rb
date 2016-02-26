class AddFirstUpdateToUsers < ActiveRecord::Migration
  def change
    add_column :users, :first_update, :text
  end
end
