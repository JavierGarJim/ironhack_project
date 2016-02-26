class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :template

      t.timestamps null: false
    end
  end
end
