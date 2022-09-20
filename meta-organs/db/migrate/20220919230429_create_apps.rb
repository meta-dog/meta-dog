class CreateApps < ActiveRecord::Migration[7.0]
  def change
    create_table :apps do |t|
      t.string :app_id
      t.string :name

      t.timestamps
    end
  end
end
