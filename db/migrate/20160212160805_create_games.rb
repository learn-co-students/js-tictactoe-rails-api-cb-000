class CreateGames < ActiveRecord::Migration[4.2]
  def change
    create_table :games do |t|
      t.text :state

      t.timestamps null: false
    end
  end
end
