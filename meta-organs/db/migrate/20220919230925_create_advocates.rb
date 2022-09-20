class CreateAdvocates < ActiveRecord::Migration[7.0]
  def change
    create_table :advocates do |t|
      t.string :meta_id

      t.timestamps
    end
  end
end
