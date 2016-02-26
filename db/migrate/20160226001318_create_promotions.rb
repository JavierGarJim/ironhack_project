class CreatePromotions < ActiveRecord::Migration
  def change
    create_table :promotions do |t|
      t.string :template

      t.timestamps null: false
    end
  end
end
