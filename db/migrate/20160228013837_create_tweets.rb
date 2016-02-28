class CreateTweets < ActiveRecord::Migration
  def change
    create_table :tweets do |t|
      t.string :id_str

      t.timestamps null: false
    end
  end
end
