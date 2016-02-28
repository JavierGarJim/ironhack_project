class RemoveLastUpdateFromUsers < ActiveRecord::Migration
  def change
    remove_column :users, :last_update, :text
  end
end
