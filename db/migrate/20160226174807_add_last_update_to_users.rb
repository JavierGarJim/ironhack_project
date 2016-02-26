class AddLastUpdateToUsers < ActiveRecord::Migration
  def change
    add_column :users, :last_update, :text
  end
end
