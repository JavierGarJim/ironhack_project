class RemoveLastRequestFromUsers < ActiveRecord::Migration
  def change
    remove_column :users, :last_request, :datetime
  end
end
