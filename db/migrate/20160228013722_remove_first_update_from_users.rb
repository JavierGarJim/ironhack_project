class RemoveFirstUpdateFromUsers < ActiveRecord::Migration
  def change
    remove_column :users, :first_update, :text
  end
end
