class AddUsersToPromotions < ActiveRecord::Migration
  def change
    add_reference :promotions, :user, index: true, foreign_key: true
  end
end
